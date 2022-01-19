import _doForceRefreshSelection from "./_doForceRefreshSelection"

export default {
    command: 'push.mode.view',
    execute: function (editor, modeView = 'CanvasView') {
        editor.modeViewManager.pushMode(modeView);
    }
}