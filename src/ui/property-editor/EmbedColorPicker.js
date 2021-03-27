import { registElement } from "@sapa/registerElement";
import UIElement, { EVENT } from "@sapa/UIElement";
import "./ColorPickerEditor";


export default class EmbedColorPicker extends UIElement {

    initState() {
      return {
        value: this.props.value || 'rgba(0, 0, 0, 1)'
      }
    }

    template () {
      return /*html*/`
        <div class='embed-color-picker'>
          <object refClass="ColorPickerEditor" 
            ref='$colorpicker' 
            key="colorpicker" 
            value="${this.state.value}" 
            onchange='localChangeColor' 
            onchangeend='localLastUpdate' 
          />        
        </div>
      `
    }

    [EVENT('localChangeColor')](key, color) {
      this.parent.trigger(this.props.onchange, color);
    }

    [EVENT('localLastUpdate')](key, color) {
      this.parent.trigger(this.props.onchangeend, color);
    }  

    setValue (color) {
      this.state.value = color; 
      this.children.$colorpicker.initColor(color);
    }

    refresh() {
      this.children.$colorpicker.initColor(this.props.value);
    }

}

registElement({ EmbedColorPicker })