export default {
    command : 'clipboard.copy',
    title: 'Copy',
    description : 'Copy',
    execute: function (editor) {
        editor.clipboard.push({
            type: 'copy',
            data: editor.selection.ids
        })
    }
}