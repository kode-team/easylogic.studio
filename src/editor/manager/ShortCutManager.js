import { isArray } from "../../util/functions/func";

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
        this.list.push({
            key: '',
            command: '',
            args: [],
            eventType: 'keydown',
            ...shortcut, 
            checkKeyString: this.splitShortCut(shortcut.key)
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
            else if (key.includes('CMD') || key.includes('WIN')) isMeta = true; 
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

    checkShortCut (keyString) {
        return this.commands[keyString]
    }

    execute (e, eventType = 'keydown') {
        let commands = this.checkShortCut(this.makeKeyString(e))

        if (commands) {
            commands.filter(it => it.eventType === eventType).forEach(it => {
                this.$editor.emit(it.command, it.args);
            })
        }
    }
}