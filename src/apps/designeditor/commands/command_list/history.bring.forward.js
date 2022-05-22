export default {
  command: "history.bring.forward",
  description: "bring forward",
  execute: function (
    editor,
    message,
    layer = editor.context.selection.current
  ) {
    // 다음으로 보내기
    const currentLayer = editor.get(layer);
    const lastValues = currentLayer.hierarchy;
    const oldParentLayer = currentLayer.parent;

    // 마지막일때
    // 다음 부모의 첫번째 자식을 선택한다.
    let currentValues = {};
    let nextParentLayer = null;
    if (currentLayer.isLast) {
      nextParentLayer = oldParentLayer.next;

      if (!nextParentLayer) {
        return;
      }

      if (nextParentLayer.enableHasChildren()) {
        nextParentLayer.appendChild(currentLayer);

        currentValues = currentLayer.hierarchy;
      } else {
        nextParentLayer.insertAfter(currentLayer);

        currentValues = currentLayer.hierarchy;
      }
    } else {
      currentLayer.parent.bringForward(currentLayer.id);
      currentValues = currentLayer.hierarchy;
    }

    // 마지막을 다시 업데이트 함
    // 수집된 커맨드 동시에 실행
    editor.context.commands.emit("setAttribute", {
      // 현재 객체 정보 변경
      ...oldParentLayer.attrsWithId("children"),

      ...currentLayer.attrsWithId("x", "y", "angle"),

      ...currentLayer.parent.attrsWithId("children"),
    });

    editor.nextTick(() => {
      editor.context.history.add(message, this, {
        currentValues: [currentValues],
        undoValues: [lastValues],
      });
    });

    editor.nextTick(() => {
      editor.context.history.saveSelection();
    });
  },

  redo: function (
    editor,
    { currentValues: [newValues], undoValues: [lastValues] }
  ) {
    const currentLayer = editor.get(newValues.id);
    const currentTarget = editor.get(newValues.parentId);
    const lastParent = editor.get(lastValues.parentId);

    currentTarget.insertChild(currentLayer, newValues.index);
    currentLayer.reset(newValues.attrs);

    editor.context.commands.emit("setAttribute", {
      ...lastParent.attrsWithId("children"),
      ...currentLayer.attrsWithId("x", "y", "angle"),
      ...currentTarget.attrsWithId("children"),
    });
  },

  undo: function (
    editor,
    { currentValues: [newValues], undoValues: [lastValues] }
  ) {
    const currentLayer = lastValues;

    const lastLayer = editor.get(currentLayer.id);
    const lastParent = editor.get(currentLayer.parentId);
    const currentParent = editor.get(newValues.parentId);

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
