export default {
    command: 'keymap.keydown',
    execute: function (editor, e) {
        editor.keyboardManager.add(e.code, e.keyCode);

        if (editor.shortcuts) {
            editor.shortcuts.execute(e, 'keydown');
        }

    }

}