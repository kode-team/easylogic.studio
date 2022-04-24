export default class JSONRenderer {
  constructor(editor) {
    this.editor = editor;
  }

  getDefaultRendererInstance() {
    return this.editor.getRendererInstance("json", "rect");
  }

  getRendererInstance(item) {
    return (
      this.editor.getRendererInstance("json", item.itemType) ||
      this.getDefaultRendererInstance() ||
      item
    );
  }

  /**
   *
   * @param {Item} item
   */
  async render(item, renderer) {
    if (!item) return;
    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return await currentRenderer.render(item, renderer || this);
    }
  }

  async renderAll(items, renderer) {
    return await Promise.all(
      items.map(async (it) => {
        return await this.render(it, renderer);
      })
    );
  }

  async getResourceDataURI() {}
}
