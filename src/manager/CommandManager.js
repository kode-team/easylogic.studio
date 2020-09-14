import { isObject, isFunction } from "@core/functions/func";
import commands from "@commands";

export class CommandManager {
    constructor (editor) {
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

    registerCommand (command, commandCallback) {

        if (arguments.length === 2) {
            const callback = (...args) => {
                commandCallback.call(this, this.$editor, ...args);
            }
            callback.source = command;
            this.$editor.$store.on(command, callback, this, 0);

        } else if (isObject(command)) {     // command object { command, title, description, debounce, execute }
            const callback = (...args) => {
                command.execute.call(command, this.$editor, ...args);
            }
            callback.source = command.command;
            this.$editor.$store.on(command.command, callback, this, command.debounce || 0);
        }

    }
}