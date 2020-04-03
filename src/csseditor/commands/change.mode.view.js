import _refreshSelection from "./_refreshSelection"

export default {
    command: 'change.mode.view',
    execute: function (editor, modeView = 'CanvasView') {
        editor.changeModeView(modeView);
    }
}