import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";
import PolygonDataEditor from "../property-editor/PolygonDataEditor";


export default class PolygonDataProperty extends BaseProperty {

  getTitle() {
    return "Polygon";
  }

  getClassName() {
    return "item polygon-data-property"
  }

  isSVGItem  (current) {
    return current.is('svg-polygon')
  }

  components () {
    return {
      PolygonDataEditor
    }
  }


  [EVENT('refreshPathLayer', 'refreshStyleView', 'refreshRect') + DEBOUNCE(100)]() {
    this.refresh();
  }  

  [EVENT('refreshSelection')]() {

    this.refreshShow('svg-polygon')

  }

  refresh() {
    // update 를 어떻게 할지 고민 

    var current = editor.selection.current || {};
    this.children.$polygonData.setValue(current.points);
  }

  getBody() {
    var current = editor.selection.current || {};

    return /*html*/`
      <div>
        <PolygonDataEditor ref='$polygonData' key='points' value='${current.points || ''}' onchange='changeValue' />
      </div>
    `;
  }


  [EVENT('changeValue')] (key, value, params) {
    editor.selection.reset({ 
      [key]: value
    })
    this.emit("refreshSelectionStyleView");
  }
}
