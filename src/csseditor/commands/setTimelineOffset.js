import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'setTimelineOffset',
    debounce: 100,
    execute: function (editor, obj) {
        _currentArtboard(editor, (artboard, timeline) => {
            artboard.setTimelineKeyframeOffsetValue(obj.layerId, obj.property, obj.id, obj.value, obj.timing, obj.time);
            editor.emit('refreshTimeline');
        })
    }
}