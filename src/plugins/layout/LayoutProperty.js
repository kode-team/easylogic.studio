
import { IF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF} from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './LayoutProperty.scss';
import { variable } from 'el/sapa/functions/registElement';

export default class LayoutProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('layout.property.title');
  }

  getLayoutOptions () {
    return variable(['default', 'flex', 'grid'].map(it => {
        return { value: it, text: this.$i18n(`layout.property.${it}`) }
    }));
  }

  getClassName() {
    return 'elf--layout-property';
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

  [SUBSCRIBE_SELF('changeLayoutInfo')] (key, value) {
    this.command('setAttributeForMulti', 'change layout info', this.$selection.packByValue({ 
      [key]: value
    }))

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize');    
    })

  }

  [SUBSCRIBE_SELF('changeLayoutType')] (key, value) {

    this.$selection.reset(this.$selection.packByValue({ 
      [key]: value
    }))

    this.command('setAttributeForMulti', 'change layout type', this.$selection.packByValue({ 
      [key]: value
    }))

    this.nextTick(() => {
      this.refresh();
      this.emit('refreshAllElementBoundSize');
      this.emit('changeItemLayout')
    })

  }

  get editableProperty() {
    return 'layout'
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }
}