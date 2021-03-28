import _currentProject from "./_currentProject";

export default {
    command: 'setTimelineOffset',
    debounce: 100,
    execute: function (editor, obj) {
        _currentProject(editor, (project, timeline) => {
            project.setTimelineKeyframeOffsetValue(obj.layerId, obj.property, obj.id, obj.value, obj.timing, obj.time);
            editor.emit('refreshTimeline');
        })
    }
}