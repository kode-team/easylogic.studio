import _currentProject from "./_currentProject";
import { isArrayEquals } from "../../util/functions/func";

export default {
    command: 'history.refreshSelection',
    description: 'save selection in history ',
    execute: function (editor) {
        const currentValues = editor.selection.ids; 
        const undoValues = editor.history.selectedIds

        // 이전 선택과 같으면 선택 히스토리는 쌓지 않는다. 
        if (isArrayEquals(currentValues, undoValues)) {
            return;
        }

        editor.history.add('selection', this, {
            currentValues,
            undoValues
        })

        this.nextAction(editor);
    },

    nextAction (editor) {
        editor.nextTick(() => {
            editor.history.saveSelection()
            editor.emit('refreshSelection');

            editor.nextTick(() => {
                editor.emit('refreshSelectionTool');
            })

        })
    },

    redo : function (editor, { currentValues }) {
        editor.selection.selectById(currentValues)

        this.nextAction(editor);
    },
    undo: function (editor, { undoValues }) {
        editor.selection.selectById(undoValues)

        this.nextAction(editor);      
    }
}