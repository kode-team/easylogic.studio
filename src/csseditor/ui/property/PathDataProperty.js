import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import PathDataEditor from "../property-editor/PathDataEditor";
import { DEBOUNCE } from "../../../util/Event";


export default class PathDataProperty extends BaseProperty {

  getTitle() {
    return "Path";
  }

  getClassName() {
    return "item path-data-property"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-textpath')
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

    this.refreshShow(['svg-path', 'svg-textpath'])

  }

  refresh() {
    // update 를 어떻게 할지 고민 

    var current = editor.selection.current || {};
    this.children.$pathData.setValue(current.d);
  }

  getBody() {
    var current = editor.selection.current || {};

    console.log(current);

    return /*html*/`
      <div>
        <PathDataEditor ref='$pathData' key='d' value='${current.d}' onchange='changeValue' />
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
