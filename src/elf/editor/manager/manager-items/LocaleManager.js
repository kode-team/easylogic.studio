export class LocaleManager {
  constructor(editor) {
    this.$editor = editor;

    this.load();
  }

  load() {
    this.locale = this.$editor.loadItem("locale") || "en_US";
  }

  toString() {
    return this.locale;
  }
}
