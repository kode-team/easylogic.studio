import BaseProperty from "./BaseProperty";
import { DEBOUNCE, LOAD, SUBSCRIBE} from "el/base/Event";

import { registElement } from "el/base/registerElement";

export default class LayoutProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('layout.property.title');
  }

  getLayoutOptions () {
    return ['default', 'flex', 'grid'].map(it => {
        return `${it}:${this.$i18n(`layout.property.${it}`)}`
    }).join(',');
  }

  getClassName() {
    return 'layout-property';
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$layoutType'></div>
      `;
  }  

  [LOAD('$layoutType')] () {
    var current = this.$selection.current || { layout : 'default' }
    return /*html*/`
      <div class='layout-select'>
        <object refClass="SelectIconEditor" 
          ref='$layout' 
          key='layout' 
          icon="true" 
          value="${current.layout}"
          options="${this.getLayoutOptions()}"  
          colors=",green,red"
          onchange="changeLayoutType" />
      </div>
      <div class='layout-list' ref='$layoutList'>
        <div data-value='default' class='${current.layout === 'default' ? 'selected': ''}'></div>
        <div data-value='flex' class='${current.layout === 'flex' ? 'selected': ''}'>
          <object refClass="FlexLayoutEditor" ref='$flex' key='flex-layout' value="${current['flex-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
        <div data-value='grid' class='${current.layout === 'grid' ? 'selected': ''}'>
          <object refClass="GridLayoutEditor" ref='$grid' key='grid-layout' value="${current['grid-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
      </div>
    `
  }

  [SUBSCRIBE('changeLayoutInfo')] (key, value) {
    this.command('setAttribute', 'change layout info', { 
      [key]: value
    }, null, false, true)

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize');    
    })

  }

  [SUBSCRIBE('changeLayoutType')] (key, value) {

    this.$selection.reset({
      [key]: value 
    })

    this.command('setAttribute', 'change layout type', { 
      [key]: value
    }, null, false, true)

    this.refresh();

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize');
      this.emit('changeItemLayout')
    })

  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refreshShow(['rect', 'circle', 'artboard'], true);
  }
}

registElement({ LayoutProperty })