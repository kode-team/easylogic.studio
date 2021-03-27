export default class SimpleHTMLRender {


  async update (item, currentElement) {
    
    const $value = currentElement.$('.value-value');

    if ($value.data('value') !== `${item.value}`){
      $value.data('value', item.value);
      $value.text(item.value);
    }
  }

  /**
  * 
  * @param {Item} item 
  */
  render (item) {
    var {id, options, value} = item;

    return /*html*/`
      <div class='element-item simple' data-id="${id}">
        <div class='simple-area' style="width:100%;height:100%;overflow:auto;padding:10px;pointer-events:none;">
          <div class='value-value' data-value='${value}'>${value}</div>
          ${options.map(it => `<div>option ${it}</div>`)}
        </div>
      </div>`
  }

}