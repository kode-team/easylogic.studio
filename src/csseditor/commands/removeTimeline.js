import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'removeTimeline',
    execute: function (editor, layerId) {
        _currentArtboard(editor, (artboard, timeline) => {
            artboard.removeTimeline(layerId);

            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('refreshSelectedOffset');
        })
    }

}