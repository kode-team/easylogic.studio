import { TargetActionType } from "elf/editor/types/model";

/**
 * @command history.moveLayerToTarget
 *
 * 선택된 레이어를 타겟 레이어로 이동한다.
 * 이동하는 시점의 정보를 history 스택에 넣어둔다.
 * undo/redo 를 할 수 있다.
 * targetAction 에 따라 이동하는 방향이 다르다.
 */
export default {
  command: "history.moveLayerToTarget",
  description: "move layer to target in world ",
  execute: function (
    editor,
    message,
    layer,
    target,
    dist = [0, 0, 0],
    targetAction = TargetActionType.APPEND_CHILD
  ) {
    const currentLayer = editor.get(layer) || layer;
    const currentParentLayer = currentLayer.parent;
    const currentTarget =
      editor.get(target) || editor.context.selection.currentProject;

    const lastValues = currentLayer.hierachy;

    if (dist) {
      // 움직임이 있을 때만 움직임
      currentLayer.absoluteMove(dist);
    }

    let currentValues = {};

    if (targetAction === TargetActionType.APPEND_CHILD) {
      currentTarget.appendChild(currentLayer);
      currentValues = currentTarget.attrsWithId("children");
    } else if (targetAction === TargetActionType.INSERT_BEFORE) {
      currentTarget.insertBefore(currentLayer);
      currentValues = currentTarget.parent.attrsWithId("children");
    } else if (targetAction === TargetActionType.INSERT_AFTER) {
      currentTarget.insertAfter(currentLayer);
      currentValues = currentTarget.parent.attrsWithId("children");
    }

    // 수집된 커맨드 동시에 실행
    editor.context.commands.emit("setAttribute", {
      // 현재 객체 정보 변경
      ...currentLayer.attrsWithId("x", "y", "angle", "parentId"),

      // target item 의 부모 정보 변경
      ...currentValues,

      // 이전 부모 정보 변경
      // 이걸 해야 이전 부모의 자식들의 위치를 제대로 맞춰줄 수 있음.
      ...(currentParentLayer && currentParentLayer.isNot("project")
        ? currentParentLayer.attrsWithId("children")
        : {}),
    });

    editor.nextTick(() => {
      editor.context.history.add(message, this, {
        currentValues: [currentLayer.hierachy],
        undoValues: [lastValues, currentLayer.parentId],
      });

      // editor.context.selection.reselect();
    });

    editor.nextTick(() => {
      editor.context.history.saveSelection();
    });
  },

  redo: function (editor, { currentValues: [info] }) {
    const currentLayer = editor.get(info.id);
    const currentTarget = editor.get(info.parentId);

    currentTarget.insertChild(currentLayer, info.index);
    currentLayer.reset(info.attrs);

    editor.context.commands.emit("setAttribute", {
      ...currentLayer.attrsWithId("x", "y", "angle", "parentId"),
      ...currentTarget.attrsWithId("children"),
    });
  },

  undo: function (editor, { undoValues: [lastValues, currentParentId] }) {
    const currentLayer = lastValues;

    const lastLayer = editor.get(currentLayer.id);
    const lastParent = editor.get(currentLayer.parentId);
    const currentParent = editor.get(currentParentId);

    // FIXME: prev, next 에 따른 위치를 찾아서 이동해야함 , 그래야 버그 가능성을 줄일 수 있다.
    const lastIndex = currentLayer.index;

    lastParent.insertChild(lastLayer, lastIndex);
    lastLayer.reset(lastValues.attrs);

    editor.context.commands.emit("setAttribute", {
      ...lastLayer.attrsWithId("x", "y", "angle"),
      ...lastParent.attrsWithId("children"),
      ...currentParent.attrsWithId("children"),
    });
  },
};
