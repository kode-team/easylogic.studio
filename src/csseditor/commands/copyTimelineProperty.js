import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'copyTimelineProperty',
    execute: function (editor, layerId, property, newTime = null) {

        _currentArtboard(editor, (artboard, timeline) => {
            artboard.copyTimelineKeyframe(layerId, property, newTime);
            
            editor.emit('refreshTimeline');
        })
    }        

}