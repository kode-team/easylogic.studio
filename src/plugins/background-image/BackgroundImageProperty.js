
import {
  LOAD, CLICK, SUBSCRIBE, SUBSCRIBE_SELF, IF
} from "el/sapa/Event";

import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";



export default class BackgroundImageProperty extends BaseProperty {

  
  getTitle() {
    return this.$i18n('background.image.property.title');
  }

  hasKeyframe () {
    return true; 
  }

  afterRender () {
    this.show();
  }

  getKeyframeProperty () {
    return 'background-image';
  }

  getClassName() {
    return 'background-image'
  }

  getBodyClassName() {
    return 'no-padding';
  }

  getBody() {
    return /*html*/`
      <div class='full' ref='$property'></div>               
    `;
  }


  getTools() {
    return `<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$backgroundImageEditor.trigger('add');
  }  

  [LOAD('$property')] () {
    var current = this.$selection.current || {}; 
    var value = current['background-image'] || ''

    return /*html*/`<object refClass="BackgroundImageEditor" 
              ref='$backgroundImageEditor' 
              key='background-image'
              value='${value}' 
              hide-label="true"
              onchange='changeBackgroundImage' 
            />`
  }

  get editableProperty() {
    return 'background-image';
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }

  [SUBSCRIBE_SELF('changeBackgroundImage')] (key, value) {
    this.command('setAttributeForMulti', 'change background image', this.$selection.packByValue({ 
      [key]: value
    }))
  }

}