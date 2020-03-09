import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'removeTimelineProperty',
    execute: function (editor, layerId, property) {
        _currentArtboard(editor, (artboard, timeline) => {
            artboard.removeTimelineProperty(layerId, property);

            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('refreshSelectedOffset');            
        })
    }

}