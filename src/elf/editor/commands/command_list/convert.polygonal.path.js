import { PathParser } from "elf/editor/parser/PathParser";
export default {
  command: "convert.polygonal.path",
  description: "convert path to polygonal path",
  execute: (editor) => {
    const current = editor.selection.current;

    if (!current) return;

    editor.command(
      "setAttributeForMulti",
      "polygonal path string",
      editor.selection.packByValue(
        current.updatePath(PathParser.fromSVGString(current.d).polygonal().d)
      )
    );
  },
};
