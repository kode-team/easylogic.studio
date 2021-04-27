import { SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";
import UIElement, { EVENT } from "el/base/UIElement";
import { EditorElement } from "../common/EditorElement";
import "./ColorPickerEditor";


export default class EmbedColorPicker extends EditorElement {

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

    [SUBSCRIBE('localChangeColor')](key, color) {
      this.parent.trigger(this.props.onchange, color);
    }

    [SUBSCRIBE('localLastUpdate')](key, color) {
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