import LayerRender from 'el/editor/renderer/HTMLRenderer/LayerRender';
import { VUE_COMPONENT_TYPE } from './constants';
  
export default class VueComponentHTMLRender extends LayerRender {

  async loadLibrary () {
    return {
      createMyComponent: (await import(/* webpackChunkName: "vue-component-plugin" */ './createMyComponent')).default,
    }
  }

  async update (item, currentElement) {
    const {createMyComponent} = await this.loadLibrary();

    let $vueComponentArea = currentElement.$(".vue-component-area");
    if ($vueComponentArea) {
      createMyComponent(item.attrs('value', 'background-color'), $vueComponentArea.el);
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
      <div class='element-item ${VUE_COMPONENT_TYPE}' data-id="${id}">
        ${this.toDefString(item)}
        <div class='vue-component-area' data-domdiff-pass="true" style="width:100%;height:100%;"></div>
      </div>`
  }

}