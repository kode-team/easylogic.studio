import { vertiesToRectangle } from "elf/core/collision";

export default {
  command: "same.width",
  description: "fit at the same width",
  execute: function (editor) {
    // console.log(editor.context.selection.isMany);

    if (editor.context.selection.isMany) {
      const rect = vertiesToRectangle(editor.context.selection.verties);

      editor.command(
        "setAttributeForMulti",
        "fit at the same width",
        editor.context.selection.packByValue({
          x: rect.x,
          width: rect.width,
        })
      );
    }
  },
};
