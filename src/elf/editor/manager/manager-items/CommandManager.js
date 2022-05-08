import { isObject, isFunction } from "sapa";

export class CommandManager {
  constructor(editor) {
    this.$editor = editor;
    this.promiseProxy = this.localCommands = {};
    this.loadCommands();

    return new Proxy(this, {
      get: (target, key) => {
        var originMethod = target[key];
        if (isFunction(originMethod)) {
          // method tracking
          return (...args) => {
            return originMethod.apply(target, args);
          };
        } else {
          return this.makePromiseEvent(key);
        }
      },
    });
  }

  loadCommands(userCommands = {}) {
    Object.keys(userCommands).forEach((command) => {
      if (isFunction(userCommands[command])) {
        this.registerCommand(command, userCommands[command]);
      } else {
        this.registerCommand(userCommands[command]);
      }
    });
  }

  /**
   * command 를 등록한다.
   * 등록 이후에 커맨드 실행 이후 종료시킬 함수를 리턴해준다.
   * 종료를 하게 되면 command 에서 빠지게 된다.
   *
   * @returns {Function} dispose callback
   */
  registerCommand(command, commandCallback) {
    if (this.localCommands[command]) {
      throw new Error(`command ${command} is already registered`);
    }

    if (arguments.length === 2) {
      const callback = (...args) => {
        const result = commandCallback.call(this, this.$editor, ...args);
        this.$editor.debug("command execute", this, ...args);

        return result;
      };
      callback.source = command;

      // local command 에 등록
      this.localCommands[command] = callback;

      // return this.$editor.on(command, callback, this, 0);
    } else if (isObject(command)) {
      // command object { command, title, description, debounce, execute }
      const callback = (...args) => {
        const result = command.execute.call(command, this.$editor, ...args);
        this.$editor.debug("command execute", command, ...args);

        return result;
      };
      callback.source = command.command;

      // local command 에 등록
      this.localCommands[command.command] = callback;

      // return this.$editor.on(
      //   command.command,
      //   callback,
      //   command,
      //   command.debounce || 0
      // );
    }
  }

  getCallback(command) {
    return this.localCommands[command];
  }

  makePromiseEvent(command) {
    const callback = this.getCallback(command);

    if (callback) {
      return (...args) =>
        new Promise((resolve) => {
          resolve(callback(...args));
        });
    }
  }

  executeCommand(command, description, ...args) {
    if (this.$editor.context.stateManager.isPointerUp) {
      command = `history.${command}`;

      const callback = this.getCallback(command);

      return callback(description, ...args);
    } else {
      return this.emit(command, ...args);
    }
  }

  emit(command, ...args) {
    const callback = this.getCallback(command);
    return callback(...args);
  }
}
