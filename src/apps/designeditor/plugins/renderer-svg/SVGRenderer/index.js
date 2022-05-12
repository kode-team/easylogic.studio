export default class SVGRenderer {
  constructor(editor) {
    this.editor = editor;
  }

  getDefaultRendererInstance() {
    return this.editor.getRendererInstance("svg", "rect");
  }

  getRendererInstance(item) {
    return (
      this.editor.getRendererInstance("svg", item.itemType) ||
      this.getDefaultRendererInstance() ||
      item
    );
  }

  /**
   *
   * @param {Item} item
   */
  render(item, renderer) {
    if (!item) return "";

    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return currentRenderer.render(item, renderer || this);
    }
  }

  /**
   *
   * @param {Item} item
   */
  toCSS(item) {
    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return currentRenderer.toCSS(item);
    }
  }

  /**
   *
   * @param {Item} item
   */
  toTransformCSS(item) {
    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return currentRenderer.toTransformCSS(item);
    }
  }

  /**
   *
   * 렌더링 될 style 태그를 리턴한다.
   *
   * @param {Item} item
   */
  toStyle(item, renderer) {
    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return currentRenderer.toStyle(item, renderer || this);
    }
  }

  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return currentRenderer.update(item, currentElement);
    }
  }

  /**
   * 코드 뷰용 HTML 코드를 렌더링 한다.
   * @param {Item} item
   */
  codeview(item) {
    if (!item) {
      return "";
    }

    let svgCode = this.render(item);
    svgCode = svgCode.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return /*html*/ `
<div class='svg-code'>
${svgCode && /*html*/ `<div><pre title='SVG'>${svgCode}</pre></div>`}
</div>
        `;
  }
}
