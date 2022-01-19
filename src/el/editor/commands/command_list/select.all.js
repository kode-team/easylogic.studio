export default {
    command: 'select.all',
    execute: function (editor) {
        var project = editor.selection.currentProject;
        if (project) {
            editor.selection.select(...project.layers);
            editor.emit('history.refreshSelection');
        }                    
    }
}