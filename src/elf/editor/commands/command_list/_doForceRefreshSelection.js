export default function _doForceRefreshSelection(editor) {
  editor.nextTick(() => {
    editor.emit("refreshAll");
    // editor.emit('refreshSelectionTool');
  });
}
