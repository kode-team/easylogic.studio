export default {
    command : 'segment.delete',
    execute: function (editor, current) {
        editor.emit('deleteSegment')
    }
}