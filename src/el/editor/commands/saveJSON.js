export default {
    command: 'saveJSON',
    execute: function (editor) {
        // todo: 문서 표준 포맷을 정해야함 
        editor.saveResource('projects', editor.projects)
    }    
}