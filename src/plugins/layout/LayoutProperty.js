
import { IF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF} from "el/sapa/Event";
import { variable } from 'el/sapa/functions/registElement';
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './LayoutProperty.scss';


export default class LayoutProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('layout.property.title');
  }

  getClassName() {
    return 'elf--layout-property';
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$layoutProperty'></div>
      `;
  }  

  getTools() {
    return /*html*/`
      <div ref='$layoutType'></div>
    `
  }

  [LOAD('$layoutType')] (){
    const current = this.$selection.current;

    if (!current) return '';

    return /*html*/`
      <object refClass="SelectIconEditor" ${variable({
        ref: '$layout',
        key: 'layout',
        value: current.layout,
        options: ['default', 'flex', 'grid'],
        icons: ['layout_default','layout_flex','layout_grid'],
        onchange: "changeLayoutType"
      })}
      />
    `
  }  

  [LOAD('$layoutProperty')] () {
    var current = this.$selection.current || { layout : 'default' }
    return /*html*/`
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
    console.log(key, value);
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

  enableHasChildren() {
    return this.$selection.current.enableHasChildren();
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow') + IF("enableHasChildren")]() {
    this.refresh();
  }
}