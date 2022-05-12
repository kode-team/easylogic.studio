import { PathParser } from "elf/core/parser/PathParser";

export default {
  command: "copy.path",
  description: "copy as path for item with path string(d attribute)",
  execute: function (editor) {
    const current = editor.context.selection.current;

    if (current) {
      let newPath = PathParser.fromSVGString(current.d);

      try {
        const newLayerAttrs = current.toSVGPath();

        editor.context.commands.executeCommand(
          "addLayer",
          `copy path`,
          editor.createModel({
            itemType: "svg-path",
            ...newLayerAttrs,
            ...current.updatePath(newPath.d),
          }),
          true,
          current.parent
        );
      } catch (e) {
        console.error(e);
      }
    }
  },
};
