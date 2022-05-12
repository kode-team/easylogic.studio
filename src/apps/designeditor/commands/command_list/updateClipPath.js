export default {
  command: "updateClipPath",
  description: "update clip-path property ",
  /**
   *
   * @param {Editor} editor
   * @param {object} pathObject
   * @param {string} pathObject.d    svg path 문자열
   */
  execute: function (editor, pathObject) {
    // d 속성 (path 문자열) 을 설정한다.
    editor.context.commands.executeCommand(
      "setAttribute",
      "change clip-path",
      editor.context.selection.packByValue({
        clipPath: `path(${pathObject.d})`,
      })
    );
  },
};
