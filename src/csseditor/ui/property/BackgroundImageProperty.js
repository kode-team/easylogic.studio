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
    return /*html*/`
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='background-color'></span>
        <ColorViewEditor ref='$color' label="${this.$i18n('background.color.property.color')}" key='background-color' onchange="changeColor" />
      </div>      
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

  refresh() {
    this.load();
    var current = this.$selection.current; 
    if (current) {
      this.children.$color.setValue(current['background-color'] || 'rgba(0, 0, 0, 1)')
    }
  }


  [EVENT('changeColor')] (key, color) {
    this.emit("setAttribute", { 
      [key]: color
    })
  }


  [EVENT('changeBackgroundImage') + DEBOUNCE(10)] (key, value) {
    this.emit('setAttribute', {
      [key]: value 
    })
  }
}
