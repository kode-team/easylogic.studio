export default {
    command : 'refreshCursor',
    execute: function (editor, iconType, ...args) {
        editor.emit('changeIconView', iconType, ...args)        
    }
}