export default {
  command: "segment.move.right",
  execute: function (editor, obj = { dx: 1 }) {
    const dx = +obj.dx;

    editor.emit("moveSegment", dx, 0);
  },
};
