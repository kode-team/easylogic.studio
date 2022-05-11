import { PathParser } from "elf/core/parser/PathParser";

export default function convertPath(editor, pathString, rect = null) {
  var current = editor.context.selection.current;

  // clip path 가 path 일 때
  // path 속성을 가지고 있을 때

  if (current) {
    if (current.is("svg-path", "svg-brush", "svg-textpath")) {
      var d = pathString;

      if (rect) {
        var parser = new PathParser(pathString);
        parser.scale(current.width / rect.width, current.height / rect.height);

        d = parser.d;
      }

      editor.context.commands.executeCommand(
        "setAttribute",
        "set attribute -d",
        editor.context.selection.packByValue({ d }, current.id)
      );
    } else if (current.clipPath.includes("path")) {
      var d = pathString;

      if (rect) {
        var parser = new PathParser(pathString);
        parser.scale(current.width / rect.width, current.height / rect.height);

        d = parser.d;
      }

      // path string 을 저걸로 맞추기
      editor.context.commands.executeCommand(
        "setAttribute",
        "change clip path",
        editor.context.selection.packByValue(
          { clipPath: `path(${d})` },
          current.id
        )
      );
    }
  }
}
