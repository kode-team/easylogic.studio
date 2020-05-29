import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'addTimelineItem',
    execute: function (editor, layerId) {
        _currentArtboard(editor, (artboard, timeline) => {
            if (layerId) {
                artboard.addTimelineLayer(layerId);
            } else {
                artboard.addTimeline();                
            }
            editor.emit('refreshTimeline');
            editor.emit('addTimeline');
        })
    }

}