export default {
    command: 'saveJSON',
    execute: function (editor) {
        editor.saveResource('projects', editor.projects)

        editor.emit('notify',  'alert', 'Save', 'Save the content on localStorage', 2000);
    }    
}