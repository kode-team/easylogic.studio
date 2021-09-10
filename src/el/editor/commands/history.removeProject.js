import { Editor } from "el/editor/manager/Editor";

export default {
    command : 'history.removeProject',
    description: 'remove project',

    /**
     * 객체를 삭제 한다. 삭제 할 때 history 도 남긴다. 
     * 
     * @param {Editor} editor 
     * @param {string} message 
     * @param {string|undefined} id 프로젝트 id
     */
    execute: function (editor, message, id) {

        // 삭제 할 때는 modelManager 에서 mark 를 한다. 
        const index = editor.modelManager.markRemoveProject(id);        

        editor.history.add(message, this, {
            currentValues: [id],
            undoValues: [id, index],
        })

        console.log(index);

        editor.nextTick(() =>  {
            editor.selection.selectProject(editor.modelManager.projects[0]);
            editor.emit('refreshAll')
            editor.emit('removeGuideLine');
            editor.nextTick(() => {
                editor.history.saveSelection()  
            })
        })        
    },

    redo: function (editor, {currentValues}) {

        const id = currentValues[0]

        // 삭제 할 때는 modelManager 에서 mark 를 한다. 
        editor.modelManager.markRemoveProject(id);        

        editor.nextTick(() => {
            editor.emit('refreshAll');
        })
    },

    /**
     * 생성된 undoValues 를 복구한다. 
     * 복구 할 때는 해당 객체의 부모와 위치를 같이 복구한다. 
     * 
     * @param {Editor} editor 
     * @param {Object} param1 
     * @param {string} param1.undoValues  JSON serialize 된 문자열 
     */
    undo: function (editor, { undoValues: [id, index] }) {

        editor.modelManager.unmarkRemoveProject(id, index);

        editor.nextTick(() => {
            editor.selection.selectProject(id);
            editor.emit('refreshAll');
        })
    }
}