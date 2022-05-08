export default {
  command: "moveToCenter",

  description: "Move Layer to Center on Viewport",

  /**
   *
   * @param {Editor} editor
   * @param {vec3[]} areaVerties
   * @param {boolean} withScale    scale 도 같이 조절 할지 정리
   */
  execute: function (editor, areaVerties, withScale = false) {
    if (areaVerties) {
      editor.context.viewport.moveToCenter(
        areaVerties,
        withScale ? -0.2 : 0,
        withScale
      );
    }
  },
};
