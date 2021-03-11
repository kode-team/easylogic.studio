import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK
} from "@core/Event";
import { EVENT } from "@core/UIElement";
import icon from "@icon/icon";
import { registElement } from "@core/registerElement";


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

  [EVENT('refreshSelection')]() {
    this.refreshShow(['artboard', 'rect', 'circle', 'text', 'image', 'video']);
  }

  refresh() {
    this.load();
  }

  [EVENT('changeBackgroundImage') + DEBOUNCE(10)] (key, value) {

    this.command('setAttribute', 'change background image', { 
      [key]: value
    })
  }

}

registElement({ BackgroundImageProperty })