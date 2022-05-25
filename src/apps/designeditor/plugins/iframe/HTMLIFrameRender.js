import LayerRender from "../../../../engine/html/renderer/renderer-html/HTMLRenderer/LayerRender";

export default class IFrameRender extends LayerRender {
  update(item, currentElement) {
    let $iframe = currentElement.$("iframe");

    if (item.hasChangedField("url")) {
      $iframe.attr("src", item.url || "about:blank");
    }

    if (item.hasChangedField("width", "height")) {
      $iframe.setAttr({
        width: item.width,
        height: item.height,
      });
    }

    super.update(item, currentElement);
  }

  /**
   *
   * @param {Item} item
   */
  render(item) {
    var { id, url = "about:blank", width, height } = item;

    return /*html*/ `
      <div class='element-item iframe' data-id="${id}">
        ${this.toDefString(item)}
        <iframe 
            width="${width}" 
            height="${height}" 
            style="border:0px;pointer-events:none;" 
            src="${url}"
            allowfullscreen="true"
        ></iframe>
      </div>`;
  }
}
