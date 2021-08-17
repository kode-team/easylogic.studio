export default {
    command: 'doubleclick.item',
    execute: function (editor, evt, id) {
        const item = editor.modelManager.get(id);

        if (editor.selection.isOne && item) {

            if (editor.selection.check(item)) {
                editor.emit('open.editor');
                editor.emit('removeGuideLine');
            } else {
                this.selectInWorldPosition(editor, evt, item);
            }


        } else {
            this.selectInWorldPosition(editor, evt, item);
        }
    },

    selectInWorldPosition: function (editor, evt, item) {

        if (editor.selection.hasPoint(editor.viewport.getWorldPosition(evt))) {
            editor.selection.select(item);
            editor.snapManager.clear();
            editor.emit('refreshSelectionTool', true);                
            editor.emit('history.refreshSelection');                    
        }
    }
}