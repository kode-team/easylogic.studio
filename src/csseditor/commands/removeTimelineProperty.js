import _currentProject from "./_currentProject";

export default {
    command: 'removeTimelineProperty',
    execute: function (editor, layerId, property) {
        _currentProject(editor, (project, timeline) => {
            project.removeTimelineProperty(layerId, property);

            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('refreshSelectedOffset');            
        })
    }

}