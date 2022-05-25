import LayerRender from "../../../../engine/html/renderer/renderer-html/HTMLRenderer/LayerRender";

export default class SampleRender extends LayerRender {
  update(item, currentElement) {
    const $sampleText = currentElement.$(".sample-text");

    if ($sampleText) {
      $sampleText.text(item.sampleText);
    }

    const $sampleNumber = currentElement.$(".sample-number");

    if ($sampleNumber) {
      $sampleNumber.text(item.sampleNumber);
    }

    const $sampleItems = currentElement.$(".sample-items");

    if ($sampleItems) {
      const template = [...Array(item.sampleNumber)]
        .map(
          (_, i) => /*html*/ `
            <div class="sample-item" style="background-color: yellow">${i}</div>
          `
        )
        .join("\n");

      $sampleItems.html(template);
    }

    super.update(item, currentElement);
  }

  /**
   *
   * @param {Item} item
   */
  render(item) {
    var { id, sampleText, sampleNumber } = item;

    return /*html*/ `
      <div class='element-item sample' data-id="${id}">
        ${this.toDefString(item)}
        <div>
          <div class="sample-text">${sampleText}</div>
          <div class="sample-number">${sampleNumber}</div>
          <div class="sample-items" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 10px;"></div>
        </div>
      </div>`;
  }
}
