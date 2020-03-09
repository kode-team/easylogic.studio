import { isObject } from "../../util/functions/func";

export class CommandManager {
    constructor (editor) {
        this.$editor = editor;
    }

    registerCommand (command, commandCallback) {

        if (arguments.length === 2) {
            const callback = (...args) => {
                commandCallback.call(this, this.$editor, ...args);
            }
            callback.source = command;
            this.$editor.$store.on(command, callback, this, 0);
        } else if (isObject(command)) {
            const callback = (...args) => {
                command.execute.call(command, this.$editor, ...args);
            }
            callback.source = command.command;
            this.$editor.$store.on(command.command, callback, this, command.debounce || 0);
        }

    }
}