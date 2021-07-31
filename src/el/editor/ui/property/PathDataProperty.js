import BaseProperty from "./BaseProperty";

import { DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { registElement } from "el/sapa/functions/registElement";

import './PathDataProperty.scss';
export default class PathDataProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('path.data.property.title');
  }

  getClassName() {
    return "item elf--path-data-property"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-brush', 'svg-textpath')
  }

  [SUBSCRIBE('refreshStyleView', 'refreshRect') + DEBOUNCE(100)]() {
    this.refresh();
  }  

  [SUBSCRIBE('refreshSelection')]() {

    this.refreshShow(['svg-path', 'svg-brush', 'svg-textpath'])

  }

  refresh() {
    var current = this.$selection.current || {};
    this.children.$pathData.setValue(current.d);
  }

  getBody() {
    var current = this.$selection.current || {};

    return /*html*/`
      <div>
        <object refClass="PathDataEditor" ref='$pathData' key='d' value='${current.d}' onchange='changeValue' />
      </div>
    `;
  }


  [SUBSCRIBE_SELF('changeValue')] (key, value, params) {
    this.emit("updatePathItem", this.$selection.current, {
      [key]: value 
    })
    
  }
}

registElement({ PathDataProperty })