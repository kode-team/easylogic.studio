export class VisibleManager {
  constructor(editor) {
    this.editor = editor;
    this.hiddenList = {};
  }

  get list() {
    return Object.keys(this.hiddenList);
  }

  get(key) {
    return !this.hiddenList[key];
  }

  set(key, value) {
    if (value) {
      delete this.hiddenList[key];
    } else {
      this.hiddenList[key] = true;
    }
  }

  toggle(key) {
    if (this.get(key)) {
      this.set(key, false);
    } else {
      this.set(key, true);
    }
  }
}
