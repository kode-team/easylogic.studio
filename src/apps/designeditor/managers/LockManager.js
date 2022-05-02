export class LockManager {
  constructor(editor) {
    this.editor = editor;
    this.lockList = {};
  }

  get(key) {
    return this.lockList[key];
  }

  // eslint-disable-next-line no-unused-vars
  set(key, value) {
    this.lockList[key] = true;
  }

  toggle(key) {
    if (this.lockList[key]) {
      delete this.lockList[key];
    } else {
      this.lockList[key] = true;
    }
  }
}
