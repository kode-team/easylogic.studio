export default function addText(editor, rect = {}) {
  editor.emit(
    "newComponent",
    "text",
    {
      content: "Insert a text",
      width: 300,
      height: 50,
      "font-size": 30,
      ...rect,
    },
    rect
  );
}
