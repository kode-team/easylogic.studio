import { vertiesToRectangle } from "elf/core/collision";

export default {
  command: "same.height",
  description: "fit at the same height",

  /**
   * @param {Editor} editor
   */
  execute: function (editor) {
    var len = editor.context.selection.length;

    if (len == 1) {
      // artboard 랑 크기를 맞출지 고민해보자.
    } else if (len > 1) {
      const rect = vertiesToRectangle(editor.context.selection.verties);

      editor.context.commands.executeCommand(
        "setAttribute",
        "fit at the same height",
        editor.context.selection.packByValue({
          y: rect.y,
          height: rect.height,
        })
      );
    }
  },
};
