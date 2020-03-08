import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK
} from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";


export default class BackgroundImageProperty extends BaseProperty {

  
  getTitle() {
    return this.$i18n('background.image.property.title');
  }

  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'background-image';
  }

  getClassName() {
    return 'background-image'
  }

  getBody() {
    return `
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

    return /*html*/`<BackgroundImageEditor 
              ref='$backgroundImageEditor' 
              key='background-image'
              value='${value}' 
              hide-label="true"
              onchange='changeBackgroundImage' 
            />`
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  [EVENT('changeBackgroundImage') + DEBOUNCE(10)] (key, value) {
    this.emit('setAttribute', {
      [key]: value 
    })
  }
}
