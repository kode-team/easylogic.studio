import LayerRender from 'el/editor/renderer/HTMLRenderer/LayerRender';
import { REACT_COMPONENT_TYPE } from './constants';
  
export default class ReactComponentHTMLRender extends LayerRender {

  async loadLibrary () {
    return {
      createMyComponent: (await import(/* webpackChunkName: "react-component-plugin" */ './createMyComponent')).default,
    }
  }

  async update (item, currentElement) {
    const {createMyComponent} = await this.loadLibrary();

    let $reactComponentArea = currentElement.$(".react-component-area");
    if ($reactComponentArea) {
      createMyComponent(item.attrs('value', 'background-color'), $reactComponentArea.el);
    }

    super.update(item, currentElement);
  }    



  /**
  * 
  * @param {Item} item 
  */
  render (item) {
    var {id} = item;

    return /*html*/`
      <div class='element-item ${REACT_COMPONENT_TYPE}' data-id="${id}">
        ${this.toDefString(item)}
        <div class='react-component-area' data-domdiff-pass="true" style="width:100%;height:100%;"></div>
      </div>`
  }

}