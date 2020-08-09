import _doForceRefreshSelection from "./_doForceRefreshSelection"

export default {
    command: 'change.mode.view',
    execute: function (editor, modeView = 'CanvasView') {
        editor.changeModeView(modeView);
    }
}