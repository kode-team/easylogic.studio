import { clone } from "../../util/functions/func";

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

    add (message, command, data) {
        this.undoHistories.push({ message, command, data })
        this.currentIndex++; 
        this.undoHistories.length = this.currentIndex + 1;

        this.$editor.emit('refreshHistory');
    }

    map (callback) {
        let results = [...this.undoHistories.map(callback), '-', ...this.redoHistories.map(callback)].reverse()

        return results; 
    }

    undo () {

        if (this.currentIndex < -1) return; 

        const commandObject  = this.undoHistories[this.currentIndex--]

        if (commandObject && commandObject.command) {
            commandObject.command.undo(this.$editor, commandObject.data)   
        }
        this.$editor.nextTick(() => {
            this.$editor.emit('refreshHistory');     
        })

    }

    redo () {

        if (this.currentIndex >= this.length) return; 

        // currentIndex 가 -1 부터 시작하기 때문에 ++this.currentIndex 로 index 를 하나 올리고 시작한다. 
        const commandObject  = this.undoHistories[++this.currentIndex]
        if (commandObject && commandObject.command) {
            commandObject.command.redo(this.$editor, commandObject.data)
        }
        this.$editor.nextTick(() => {
            this.$editor.emit('refreshHistory');     
        })
    }

}