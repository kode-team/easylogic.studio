export class CommandMaker {
  constructor(editor) {
    this.editor = editor;
    this.commands = [];
  }

  log() {
    console.log(this.commands);
  }

  emit(...args) {
    this.commands.push(args);
  }

  run() {
    this.editor.emit(this.commands);
  }

  add(otherCommandMaker) {
    this.commands = this.commands.concat(otherCommandMaker.commands);
  }
}
