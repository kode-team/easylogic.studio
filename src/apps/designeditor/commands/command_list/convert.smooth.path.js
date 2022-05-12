import { PathParser } from "elf/core/parser/PathParser";
export default {
  command: "convert.smooth.path",
  description: "convert path to smooth",
  execute: (editor, divideCount = 5, tolerance = 0.1, tension = 0.5) => {
    const current = editor.context.selection.current;

    if (!current) return;

    const smoothedPath = PathParser.fromSVGString(current.d)
      .divideSegmentByCount(divideCount)
      .simplify(tolerance)
      .cardinalSplines(tension).d;

    editor.context.commands.executeCommand(
      "setAttribute",
      "smooth path string",
      editor.context.selection.packByValue(current.updatePath(smoothedPath))
    );
  },
};
