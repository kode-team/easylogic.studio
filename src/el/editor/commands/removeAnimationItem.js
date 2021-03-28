import _currentProject from "./_currentProject";

export default {
    command: 'removeAnimationItem',
    execute: function (editor, id) {
        _currentProject(editor, (project, timeline) => {
            project.removeAnimation(id);

            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('removeAnimation');
        })
    }
}