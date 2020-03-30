export default {
    command: 'keymap.keydown',
    execute: function (editor, e) {
        editor.shortcuts.execute(e, 'keydown');
    }

}