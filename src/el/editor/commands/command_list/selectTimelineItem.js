export default {
    command: 'selectTimelineItem',
    execute: function (editor, selectedId) {

        const project = editor.selection.currentProject;

        if (project) {
            project.selectTimeline(selectedId);                
            editor.emit('refreshTimeline');
            editor.emit('selectTimeline');            
        }
    }

}