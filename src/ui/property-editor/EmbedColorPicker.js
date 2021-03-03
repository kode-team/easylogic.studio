import UIElement, { EVENT } from "@core/UIElement";
import ColorPickerEditor from "./ColorPickerEditor";


export default class EmbedColorPicker extends UIElement {

    components () {
      return {
        ColorPickerEditor
      }
    }

    initState() {
      return {
        value: this.props.value || 'rgba(0, 0, 0, 1)'
      }
    }

    template () {
      return /*html*/`
        <div class='embed-color-picker'>
          <span refClass="ColorPickerEditor" 
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
