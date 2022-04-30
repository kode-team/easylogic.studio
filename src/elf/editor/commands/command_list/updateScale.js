export default {
  command: "updateScale",

  /**
   * scale 설정하기
   *
   * @param {Editor} editor
   * @param {number} scale [0.5...5]
   */
  execute: function (editor, scale) {
    const oldScale = editor.context.viewport.scale;
    editor.context.viewport.setScale(scale);
    editor.emit("updateViewport", scale, oldScale);
  },
};
