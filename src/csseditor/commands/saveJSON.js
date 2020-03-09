export default {
    command: 'saveJSON',
    execute: function (editor) {
        editor.saveResource('projects', editor.projects)
    }    
}