import { BIND, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { isFunction } from "el/sapa/functions/func";
import { variable } from "el/sapa/functions/registElement";
import { Length } from 'el/editor/unit/Length';
import BasePopup from "el/editor/ui/popup/BasePopup";
import './ComponentPopup.scss';



export default class ComponentPopup extends BasePopup {

  getClassName() {
    return 'component-property w(800)';
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

  [BIND('$body')] () {
    return {
      style: {
        width: Length.px(this.state.width || 250),
      }
    }
  }

  [LOAD('$body')] () {    
    const inspector = this.state.inspector;

    return /*html*/`
      <object refClass="ComponentEditor" inspector=${variable(inspector)} onchange="changeComponent" />
    `
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