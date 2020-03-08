export class CommandManager {
    constructor (editor) {
        this.$editor = editor;
    }

    registerCommand (command, commandCallback) {
        const callback = (...args) => {
            commandCallback.call(this, this.$editor, ...args);
        }
        callback.source = command;
        this.$editor.$store.on(command, callback, this, 0);
    }
}