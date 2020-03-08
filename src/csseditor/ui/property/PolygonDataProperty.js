import BaseProperty from "./BaseProperty";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";
import PolygonDataEditor from "../property-editor/PolygonDataEditor";


export default class PolygonDataProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('polygon.data.property.title');
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

    var current = this.$selection.current || {};
    this.children.$polygonData.setValue(current.points);
  }

  getBody() {
    var current = this.$selection.current || {};

    return /*html*/`
      <div>
        <PolygonDataEditor ref='$polygonData' key='points' value='${current.points || ''}' onchange='changeValue' />
      </div>
    `;
  }


  [EVENT('changeValue')] (key, value, params) {
    this.emit("updatePolygonItem", {
      [key]: value 
    })
  }
}
