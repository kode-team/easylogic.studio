import { isObject, isFunction } from "el/sapa/functions/func";
import commands from "../commands";

export class CommandManager {
    constructor(editor) {
        this.$editor = editor;

        this.loadCommands();
    }


    loadCommands() {
        Object.keys(commands).forEach(command => {
            if (isFunction(commands[command])) {
                this.registerCommand(command, commands[command]);
            } else {
                this.registerCommand(commands[command])
            }
        })
    }

    /**
     * command 를 등록한다. 
     * 등록 이후에 커맨드 실행 이후 종료시킬 함수를 리턴해준다. 
     * 종료를 하게 되면 command 에서 빠지게 된다. 
     * 
     * @returns {Function} dispose callback 
     */
    registerCommand(command, commandCallback) {

        if (arguments.length === 2) {
            const callback = (...args) => {
                commandCallback.call(this, this.$editor, ...args);
                this.$editor.debug('command execute', this, ...args)
            }
            callback.source = command;
            return this.$editor.on(command, callback, this, 0);

        } else if (isObject(command)) {     // command object { command, title, description, debounce, execute }
            const callback = (...args) => {
                command.execute.call(command, this.$editor, ...args);
                this.$editor.debug('command execute', command, ...args)
            }
            callback.source = command.command;
            return this.$editor.on(command.command, callback, this, command.debounce || 0);
        }

    }
}