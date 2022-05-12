import { isArray } from "sapa";

export default {
  command: "history.moveLayer",
  description: "move layer in world ",
  execute: function (editor, message, layers = [], dist = [0, 0, 0]) {
    if (isArray(layers) === false) {
      layers = [layers];
    }

    const targetItems = editor.context.selection.itemsByIds(layers);

    const lastValues = {};
    const currentValues = {};

    // 절대 좌표 이동 , xy 만
    targetItems.forEach((it) => {
      // 이전 x, y 저장 ?
      const oldPosition = it.absoluteMove(dist);
      const newPosition = it.attrs("x", "y");

      lastValues[it.id] = oldPosition;
      currentValues[it.id] = newPosition;
    });

    editor.context.commands.emit("setAttribute", currentValues);

    editor.nextTick(() => {
      editor.context.history.add(message, this, {
        currentValues: [layers, dist],
        undoValues: [lastValues],
      });
    });

    editor.nextTick(() => {
      editor.context.history.saveSelection();
    });
  },

  redo: function (editor, { currentValues: [layers, dist] }) {
    const targetItems = editor.context.selection.itemsByIds(layers);
    const localChanges = {};

    // 절대 좌표 이동 , xy 만
    targetItems.forEach((it) => {
      // 이전 x, y 저장 ?
      it.absoluteMove(dist);
      const newPosition = it.attrs("x", "y");

      localChanges[it.id] = newPosition;
    });

    editor.context.commands.emit("setAttribute", localChanges);
  },

  undo: function (editor, { undoValues: [lastValues] }) {
    editor.context.commands.emit("setAttribute", lastValues);
  },
};
