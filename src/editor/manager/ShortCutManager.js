export class ShortCutManager {
    constructor (editor) {
        this.$editor = editor;
        this.list = []
    }

    registerShortCut (shortcut) {
        this.list.push({...shortcut, checkKeyString: shortcut.key.toUpperCase()});
    }

    makeKeyString(e) {
        return ''; 
    }

    checkShortCut (keyString) {
        const shortcut = this.list.filter(it => it.checkKeyString === keyString)

        if (shortcut) {
            return shortcut[0].command;
        }

        return null; 
    }

    execute (keyString) {
        let command;
        if (command = this.checkShortCut(keyString)) {
            this.$editor.emit(command);
        }
    }
}