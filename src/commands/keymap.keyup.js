export default {
    command: 'keymap.keyup',
    execute: function (editor, e) {
        editor.shortcuts.execute(e, 'keyup');
    }

}