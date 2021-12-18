import _currentProject from "./_currentProject";
import { isArrayEquals } from "el/utils/func";

export default {
    command: 'history.refreshSelection',
    description: `save selection in history `,
    description_ko: 'Selection 정보를 갱신하면서 History 에 저장한다',
    execute: function (editor, message = 'selection') {
        const currentValues = editor.selection.ids; 
        const projectId = editor.selection.currentProject?.id; 
        const undoValues = editor.history.selectedIds

        // 이전 선택과 같으면 선택 히스토리는 쌓지 않는다. 
        if (isArrayEquals(currentValues, undoValues)) {
            return;
        }

        editor.history.add(message, this, {
            currentValues: [currentValues, projectId],
            undoValues: [undoValues, projectId]
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

    redo : function (editor, { currentValues: [ids, projectId] }) {
        editor.selection.selectProject(projectId)
        editor.selection.select(...ids)

        this.nextAction(editor);
    },
    undo: function (editor, { undoValues: [ids, projectId] }) {
        editor.selection.selectProject(projectId)
        editor.selection.select(...ids)

        this.nextAction(editor);      
    }
}