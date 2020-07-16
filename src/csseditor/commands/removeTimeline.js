import _currentProject from "./_currentProject";

export default {
    command: 'removeTimeline',
    execute: function (editor, layerId) {
        _currentProject(editor, (project, timeline) => {
            project.removeTimeline(layerId);

            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('refreshSelectedOffset');
        })
    }

}