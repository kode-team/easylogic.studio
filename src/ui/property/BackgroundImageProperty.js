import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK
} from "@core/Event";
import { EVENT } from "@core/UIElement";
import icon from "@icon/icon";


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
      <div class='full' ref='$property'></div>      
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='background-color'></span>
        </div>
        <ColorViewEditor ref='$color' label="${this.$i18n('background.color.property.color')}" key='background-color' onchange="changeColor" />
      </div>            
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

  [EVENT('refreshSelection')]() {
    this.refreshShowIsNot(['project']);
  }

  refresh() {
    this.load();
    var current = this.$selection.current; 
    if (current) {
      const backgroundColor = current['background-color'] || 'rgba(0, 0, 0, 1)'
      this.children.$color.setValue(current['background-color'] || 'rgba(0, 0, 0, 1)')
      this.state.backgroundColor = backgroundColor;
    }
  }


  [EVENT('changeColor')] (key, color) {
    this.command('setAttribute', 'change background color', { 
      [key]: color
    })
  }

  [EVENT('changeBackgroundImage') + DEBOUNCE(10)] (key, value) {

    this.command('setAttribute', 'change background image', { 
      [key]: value
    })
  }

}
