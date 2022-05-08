import { PathParser } from "elf/core/parser/PathParser";
export default {
  command: "convert.normalize.path",
  description: "convert segments to bezier curve",
  execute: (editor) => {
    const current = editor.context.selection.current;

    if (!current) return;

    editor.context.commands.executeCommand(
      "setAttribute",
      "normalize path string",
      editor.context.selection.packByValue(
        current.updatePath(PathParser.fromSVGString(current.d).normalize().d)
      )
    );
  },
};
