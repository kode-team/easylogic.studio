/**
 * refresh element command
 *
 * @param {Editor} editor - editor instance
 * @param {Array} args - command parameters
 */
export default function refreshHistory(editor) {
  // 화면 사이즈 조정
  editor.context.commands.emit("saveJSON");
}
