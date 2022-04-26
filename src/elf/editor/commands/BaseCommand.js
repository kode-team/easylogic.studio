export class BaseCommand {
  constructor(command, options = {}) {
    this._command = command;
    this._options = options;
  }

  get command() {
    return this._command;
  }

  get description() {
    return this._options.description;
  }

  execute(...args) {
    this._options.execute?.(...args);
  }

  undo(...args) {
    this._options.undo?.(...args);
  }

  redo(...args) {
    this._options.redo?.(...args);
  }
}
