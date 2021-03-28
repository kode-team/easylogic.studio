import _currentProject from "./_currentProject";

export default {
    command: 'selectTimelineItem',
    execute: function (editor, selectedId) {
        _currentProject(editor, (project, timeline) => {
            project.selectTimeline(selectedId);                
            editor.emit('refreshTimeline');
            editor.emit('selectTimeline');            
        })
    }

}