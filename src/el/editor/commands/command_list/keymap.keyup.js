export default {
    command: 'keymap.keyup',
    execute: function (editor, e) {
        editor.keyboardManager.remove(e.key, e.keyCode);        
        editor.shortcuts.execute(e, 'keyup');
    }

}