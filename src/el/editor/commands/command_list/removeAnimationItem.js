export default {
    command: 'removeAnimationItem',
    execute: function (editor, id) {

        const project = editor.selection.currentProject;

        if (project) {
            project.removeAnimationItem(id);
            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('removeAnimation');
        }
    }
}