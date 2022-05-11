export default {
  command: "history.bring.front",
  description: "bring front",
  execute: function (
    editor,
    message,
    layer = editor.context.selection.current
  ) {
    // 다음으로 보내기
    const currentLayer = editor.get(layer);
    const lastValues = currentLayer.hierachy;
    const oldParentLayer = currentLayer.parent;

    // 마지막일때
    // 다음 부모의 첫번째 자식을 선택한다.
    let currentValues = {};
    if (currentLayer.isLast) {
      // NOOP
      return;
    } else {
      currentLayer.parent.bringFront(currentLayer.id);

      currentValues = currentLayer.hierarchy;
    }

    // 마지막을 다시 업데이트 함
    // 수집된 커맨드 동시에 실행
    editor.context.commands.emit("setAttribute", {
      // 현재 객체 정보 변경
      ...oldParentLayer.attrsWithId("children"),

      ...currentLayer.attrsWithId("x", "y", "angle"),
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

  redo: function (editor, { currentValues: [newValues] }) {
    const currentLayer = editor.get(newValues.id);
    const currentTarget = editor.get(newValues.parentId);

    currentTarget.insertChild(currentLayer, newValues.index);
    currentLayer.reset(newValues.attrs);

    editor.context.commands.emit("setAttribute", {
      ...currentLayer.attrsWithId("x", "y", "angle"),
      ...currentTarget.attrsWithId("children"),
    });
  },

  undo: function (editor, { undoValues: [lastValues] }) {
    const currentLayer = lastValues;

    const lastLayer = editor.get(currentLayer.id);
    const lastParent = editor.get(currentLayer.parentId);

    // FIXME: prev, next 에 따른 위치를 찾아서 이동해야함 , 그래야 버그 가능성을 줄일 수 있다.
    const lastIndex = currentLayer.index;

    lastParent.insertChild(lastLayer, lastIndex);

    editor.context.commands.emit("setAttribute", {
      ...lastLayer.attrsWithId("x", "y", "angle"),
      ...lastParent.attrsWithId("children"),
    });
  },
};
