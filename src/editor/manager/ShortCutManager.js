import { isArray } from "../../util/functions/func";
import { os } from "../../util/functions/detect";

function joinKeys (...args) {
    return args.filter(Boolean).join('+')
}

export class ShortCutManager {
    constructor (editor) {
        this.$editor = editor;
        this.list = []
        this.commands = {}
    }

    registerShortCut (shortcut) {

        const OSName = os()

        this.list.push({
            key: '',
            command: '',
            args: [],
            eventType: 'keydown',
            ...shortcut, 
            checkKeyString: this.splitShortCut(shortcut[OSName] || shortcut.key)
        });

    }

    sort() {
        this.list.forEach(it => {
            if (isArray(this.commands[it.checkKeyString]) === false) {
                this.commands[it.checkKeyString] = []
            }

            this.commands[it.checkKeyString].push(it);
        })
    }

    splitShortCut (key) {
        var arr = key.toUpperCase().split('+').map(it => it.trim()).filter(Boolean);

        let isAlt = false;
        let isControl = false;
        let isShift = false;
        let isMeta = false;
        let restKeys = []
        arr.forEach(key => {
            if (key.includes('ALT')) isAlt = true; 
            else if (key.includes('CTRL')) isControl = true; 
            else if (key.includes('SHIFT')) isShift = true; 
            else if (key.includes('CMD') || key.includes('WIN') || key.includes('META')) isMeta = true; 
            else restKeys.push(key);
        })

        return joinKeys(
            isAlt       ? 'ALT'     : '',
            isControl   ? 'CTRL'    : '',
            isShift     ? 'SHIFT'   : '',
            isMeta      ? 'META'    : '',
            restKeys.join('')
        );
    }

    makeKeyString(e) {
        return joinKeys(
            e.altKey    ? 'ALT'     : '',
            e.ctrlKey   ? 'CTRL'    : '',
            e.shiftKey  ? 'SHIFT'   : '',
            e.metaKey   ? 'META'    : '',
            e.key.toUpperCase()
        )
    }

    makeCodeString(e) {
        return joinKeys(
            e.altKey    ? 'ALT'     : '',
            e.ctrlKey   ? 'CTRL'    : '',
            e.shiftKey  ? 'SHIFT'   : '',
            e.metaKey   ? 'META'    : '',
            e.code.toUpperCase()
        )
    }    

    checkShortCut (keyString, codeString) {
        return this.commands[keyString] || this.commands[codeString]
    }

    checkWhen(command) {
        if (command.when === this.$editor.modeView) {
            return true; 
        } else if (command.when === '') {
            return true; 
        }

        return false; 
    }

    execute (e, eventType = 'keydown') {
        let commands = this.checkShortCut(this.makeKeyString(e), this.makeCodeString(e))

        if (commands) {
            const filteredCommands = commands.filter(it => it.eventType === eventType)
                                             .filter(it => this.checkWhen(it));
            if (filteredCommands.length) {
                e.preventDefault();
            }
            filteredCommands.forEach(it => {
                this.$editor.emit(it.command, it.args);
            })
        }
    }
}