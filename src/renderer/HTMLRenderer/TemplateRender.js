import LayerRender from "./LayerRender";

export default class TemplateRender extends LayerRender {
    

    update (item, currentElement) {

      if (item.renderedTemplate != item.template) {
        let $innerHTML = currentElement.$(".inner-html");
    
        if ($innerHTML) {
          $innerHTML.updateDiff(item.template);
        }
      }
    
        super.update(item, currentElement);
    }    

  /**
   * 
   * @param {Item} item 
   */
   render (item) {
    var {id, template } = item;

    // 마지막으로 렌더링된 template 을 저장해둔다. 
    // 이후 업데이트 될 때  변경시점을 확인 할 수 있다. 
    item.renderedTemplate = template; 

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