import BaseProperty from "./BaseProperty";
import { EVENT } from "@core/UIElement";
import PathDataEditor from "../property-editor/PathDataEditor";
import { DEBOUNCE } from "@core/Event";


export default class PathDataProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('path.data.property.title');
  }

  getClassName() {
    return "item path-data-property"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-brush', 'svg-textpath')
  }

  components () {
    return {
      PathDataEditor
    }
  }


  [EVENT('refreshPathLayer', 'refreshStyleView', 'refreshRect') + DEBOUNCE(100)]() {
    this.refresh();
  }  

  [EVENT('refreshSelection')]() {

    this.refreshShow(['svg-path', 'svg-brush', 'svg-textpath'])

  }

  refresh() {
    // update 를 어떻게 할지 고민 

    var current = this.$selection.current || {};
    this.children.$pathData.setValue(current.d);
  }

  getBody() {
    var current = this.$selection.current || {};

    return /*html*/`
      <div>
        <PathDataEditor ref='$pathData' key='d' value='${current.d}' onchange='changeValue' />
      </div>
    `;
  }


  [EVENT('changeValue')] (key, value, params) {
    this.emit("updatePathItem", {
      [key]: value 
    })
    
  }
}
