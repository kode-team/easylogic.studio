import LayerRender from "./LayerRender";

export default class IFrameRender extends LayerRender {
    

    update (item, currentElement) {

        let $iframe = currentElement.$("iframe");
    
        if ($iframe) {
          $iframe.attr('src', item.url || 'about:blank');    
        }
    
        super.update(item, currentElement);
    }    

  /**
   * 
   * @param {Item} item 
   */
   render (item) {
    var {id, url =  'about:blank'} = item;

    return /*html*/`
      <div class='element-item iframe' data-id="${id}">
        ${this.toDefString(item)}
        <iframe 
            width="100%" 
            height="100%" 
            style="border:0px;width:100%;height:100%;pointer-events:none;" 
            src="${url}"
        ></iframe>
      </div>`
  }
}