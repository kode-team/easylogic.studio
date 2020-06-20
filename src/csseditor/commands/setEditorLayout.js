export default {
    command: 'setEditorLayout',
    execute: function (editor, layout) {
        editor.setLayout(layout);
        editor.emit('changedEditorlayout')
    }
}