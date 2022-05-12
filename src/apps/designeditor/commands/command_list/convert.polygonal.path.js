import { PathParser } from "elf/core/parser/PathParser";
export default {
  command: "convert.polygonal.path",
  description: "convert path to polygonal path",
  execute: (editor) => {
    const current = editor.context.selection.current;

    if (!current) return;

    editor.context.commands.executeCommand(
      "setAttribute",
      "polygonal path string",
      editor.context.selection.packByValue(
        current.updatePath(PathParser.fromSVGString(current.d).polygonal().d)
      )
    );
  },
};
