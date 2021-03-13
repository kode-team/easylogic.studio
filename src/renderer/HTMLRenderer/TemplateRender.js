import LayerRender from "./LayerRender";

export default class TemplateRender extends LayerRender {
    

    update (item, currentElement) {

        let $innerHTML = currentElement.$(".inner-html");
    
        if ($innerHTML) {
          $innerHTML.updateDiff(item.template);
        }
    
        super.update(item, currentElement);
    }    

  /**
   * 
   * @param {Item} item 
   */
   render (item) {
    var {id, template } = item;

    return /*html*/`
      <div class='element-item template' data-id="${id}">
        ${this.toDefString(item)}
        <style id="style-${id}">
          [data-id="${id}"] .inner-html > * {
            width: 100%; 
            height: 100%;
          }
        </style>
        <div class="inner-html" style="position:relative;display:block;width:100%;height:100%;" >
          ${template}
        </div>
      </div>`
  }
}