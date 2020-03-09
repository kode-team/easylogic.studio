import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'selectTimelineItem',
    execute: function (editor, selectedId) {
        _currentArtboard(editor, (artboard, timeline) => {
            artboard.selectTimeline(selectedId);                
            editor.emit('refreshTimeline');
            editor.emit('selectTimeline');            
        })
    }

}