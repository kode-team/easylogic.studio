export default {
  command: "segment.move.left",
  execute: function (editor, obj = { dx: 1 }) {
    const dx = +obj.dx;

    editor.emit("moveSegment", -1 * dx, 0);
  },
};
