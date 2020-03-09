export default {
    command: 'switchTheme',
    execute:  function ( editor, theme ) {
        editor.changeTheme(theme);
        editor.emit('changeTheme')
    }
}