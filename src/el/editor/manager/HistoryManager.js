import { clone } from "el/base/functions/func";

export class HistoryManager {
    constructor (editor) {
        this.$editor = editor;

        this.currentIndex = -1; 
        this.undoHistories = [] 
        this.redoHistories = [] 
        this.selection = {}
    }

    get length () {
        return this.undoHistories.length;
    }

    get selectedIds () {
        return Object.keys(this.selection);
    }

    createCommand (commandString) {
        return this.$editor.isPointerUp ? `history.${commandString}` : commandString;
    }

    saveSelection(obj = {}) {
        this.selection = this.$editor.selection.toCloneObject()
    }

    getUndoValues (attrs = {}) {
        let result = {}

        Object.keys(this.selection).forEach(id => {
            result[id] = {}

            Object.keys(attrs).forEach(key => {
                result[id][key] = this.selection[id][key]
            })
        })

        return result;
    }

    getUndoValuesForMulti (multiAttrs = {}) {
        let result = {}

        Object.keys(multiAttrs).forEach(id => {
            result[id] = {}

            const selectedObject = this.selection[id] || this.$editor.selection.itemsByIds(id)[0];
            const attrs = multiAttrs[id];

            Object.keys(attrs).forEach(key => {
                result[id][key] = selectedObject[key]
            })
        })

        return result;
    }    

    /**
     * 
     * @param {string} message 
     * @param {CommandObject} command 
     * @param {{currentValues: any, undoValues: any, redoValues: any}} data 
     */
    add (message, command, data) {
        const historyObject = { message, command, data }
        this.undoHistories.push(historyObject)
        this.currentIndex++; 
        this.undoHistories.length = this.currentIndex + 1;

        this.$editor.emit('refreshHistory', command.command);

        return historyObject;
    }

    /**
     * undo, redo 히스토리 리스트를 만든다. 
     * 
     * @param {Function} callback 
     */
    map (callback) {
        let results = [...this.undoHistories.map(callback), '-', ...this.redoHistories.map(callback)].reverse()

        return results; 
    }

    /**
     * undo 를 수행한다. 
     */
    undo () {

        if (this.currentIndex < -1) return; 

        this.currentIndex--
        const commandObject  = this.undoHistories.pop()

        if (commandObject && commandObject.command) {
            commandObject.command.undo(this.$editor, commandObject.data)   
        }

        this.$editor.nextTick(() => {
            this.$editor.emit('refreshHistory', commandObject.command);     
        })

    }

    /**
     * redo를 수행한다.
     */
    redo () {

        if (this.currentIndex > this.length) return; 

        // currentIndex 가 -1 부터 시작하기 때문에 ++this.currentIndex 로 index 를 하나 올리고 시작한다. 
        if (this.currentIndex < 0) {
            this.currentIndex++;
        }
        const commandObject  = this.undoHistories[this.currentIndex]
        if (commandObject && commandObject.command) {
            commandObject.command.redo(this.$editor, commandObject.data)
            this.$editor.debug(commandObject)
        }
        this.$editor.nextTick(() => {
            this.$editor.emit('refreshHistory', commandObject.command);     
        })
    }

}