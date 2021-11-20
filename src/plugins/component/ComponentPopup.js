import { BIND, DEBOUNCE, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { isFunction, isString } from "el/sapa/functions/func";
import { variable } from "el/sapa/functions/registElement";
import { Length } from 'el/editor/unit/Length';
import BasePopup from "el/editor/ui/popup/BasePopup";
import './ComponentPopup.scss';



export default class ComponentPopup extends BasePopup {

  getClassName() {
    return 'component-property';
  }

  getTitle() {
    return "Component";
  }

  initState() {
    return {
      title: '',
      inspector: []
    };
  }

  refresh() {
    this.setTitle(this.state.title || this.getTitle());
    this.load();
  }

  getBody() {
    return /*html*/`
      <div ref='$body'></div>
    `;
  }

  getPropertyEditor (index, inspectorItem) {
    return /*html*/`
        <object 
          refClass="${inspectorItem.editor}" 
          ${variable({
            onchange: 'changeComponent',
            ref: `${inspectorItem.key}${index}`,
            key: inspectorItem.key,
            ...inspectorItem.editorOptions,            
          })} 
        />
      `
  }

  [BIND('$body')] () {
    return {
      style: {
        width: Length.px(this.state.width || 250),
      }
    }
  }

  [LOAD('$body')] () {    
    const inspector = this.state.inspector;

    var self = inspector.map((it, index)=> {
      if (isString(it)) {
        return /*html*/`
          <div class='popup-item is-label'> 
            <label class='label string-label'>${it}</label>
          </div>`
      } else {


        return /*html*/`
          <div class='popup-item'> 
            ${this.getPropertyEditor(index, it)}
          </div>
        `
      }

    })

    return self; 
  }

  [SUBSCRIBE_SELF('changeComponent')] (key, value) {

    if (isFunction(this.state.changeEvent)) {
      this.emit(this.state.changeEvent, key, value)
    } 

  }


  [SUBSCRIBE("showComponentPopup")](data) {

    this.setState(data, false);

    this.refresh();

    this.show(data.width)
  }


}