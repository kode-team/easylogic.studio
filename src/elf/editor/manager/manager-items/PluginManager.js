export class PluginManager {
  constructor(editor) {
    this.editor = editor;
    this.plugins = [];
  }

  registerPlugin(func) {
    this.plugins.push(func);
  }

  /**
   * 플러그인 초기화를 비동기로 한다.
   *
   */
  async initializePlugin(options = {}) {
    return await Promise.all(
      this.plugins.map(async (CreatePluginFunction) => {
        return await CreatePluginFunction(this.editor, options);
      })
    );
  }
}
