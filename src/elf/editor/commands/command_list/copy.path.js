import { PathParser } from "elf/editor/parser/PathParser";

export default {
  command: "copy.path",
  description: "copy as path for item with path string(d attribute)",
  execute: function (editor) {
    const current = editor.context.selection.current;

    if (current) {
      let newPath = PathParser.fromSVGString(current.d);

      try {
        const newLayerAttrs = current.toSVGPath();

        editor.command(
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
