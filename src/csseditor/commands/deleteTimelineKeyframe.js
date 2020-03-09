import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'deleteTimelineKeyframe',
    execute: function (editor) {
        _currentArtboard(editor, (artboard, timeline) => {
            editor.timeline.each(item => {
                artboard.deleteTimelineKeyframe(item.layerId, item.property, item.id);
            })

            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('refreshSelectedOffset');
        })
    }
}