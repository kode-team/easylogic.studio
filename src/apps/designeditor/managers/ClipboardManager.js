export class ClipboardManager {
  constructor(editor) {
    this.editor = editor;
    this.clipboard = [];
  }

  get length() {
    return this.clipboard.length;
  }

  clear() {
    this.clipboard = [];
  }

  get isEmpty() {
    return this.clipboard.length == 0;
  }

  get last() {
    return this.clipboard[this.clipboard.length - 1];
  }

  push(data) {
    this.clipboard.push(data);
  }

  pop() {
    return this.clipboard.pop();
  }
}
