export default {
  command: "segment.move.up",
  execute: function (editor, obj = { dy: 1 }) {
    const dy = +obj.dy;

    editor.emit("moveSegment", 0, -1 * dy);
  },
};
