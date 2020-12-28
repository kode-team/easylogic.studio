export default {
    command: 'keymap.keydown',
    execute: function (editor, e) {
        editor.keyboardManager.add(e.code, e.keyCode);
        editor.shortcuts.execute(e, 'keydown');
    }

}