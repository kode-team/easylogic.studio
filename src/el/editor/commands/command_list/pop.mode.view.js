import _doForceRefreshSelection from "./_doForceRefreshSelection"

export default {
    command: 'pop.mode.view',
    execute: function (editor, modeView = undefined) {
        editor.modeViewManager.popMode(modeView);
    }
}