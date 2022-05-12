import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default function resizeArtBoard(editor, size = "") {
  var current = editor.context.selection.current;
  if (current && current.is("artboard")) {
    if (!size.trim()) return;

    var [width, height] = size.split("x");

    width = +width;
    height = +height;

    current.resize(width, height);
    editor.context.selection.select(current);

    _doForceRefreshSelection(editor);
  }
}
