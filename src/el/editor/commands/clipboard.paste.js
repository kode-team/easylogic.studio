export default {
    command : 'clipboard.paste',
    execute : async function (editor, event) {

        if (editor.selection.length && editor.selection.copyItems.length) {
            editor.selection.paste();
            editor.emit('refreshAll')
        } else {
            var text = await navigator.clipboard.readText()

            if (text) {
                editor.emit('convertPasteText', text)
            }            
        }
    }
}