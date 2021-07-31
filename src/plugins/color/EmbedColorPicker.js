import { SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";


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

    [SUBSCRIBE_SELF('localChangeColor')](key, color) {
      this.parent.trigger(this.props.onchange, color);
    }

    [SUBSCRIBE_SELF('localLastUpdate')](key, color) {
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