import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";


import RangeEditor from "../property-editor/RangeEditor";
import SelectEditor from "../property-editor/SelectEditor";


export default class MotionProperty extends BaseProperty {
  components() {
    return {
      RangeEditor,
      SelectEditor
    }
  }

  getTitle() {
    return "Motion";
  }

  [EVENT('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  refresh() {

    var currentProject = editor.selection.currentProject;
    var options = ''
    var paths = {}
    if (currentProject) {
      currentProject.artboards.forEach(artboard => {
        artboard.allLayers.filter(it => it.is('svg-path', 'svg-polygon')).forEach(it => {
          paths[it.id] = it.d; 
        });
      })

      options = ',' + Object.keys(paths).join(',');
    }
 
    this.state.paths = paths; 
    this.children.$path.setOptions(options);
  }

  getBody() {
    return `
      <div class='property-item'>
        <SelectEditor ref='$path' label='Path' removable="true" key='path' onchange='changRangeEditor' />
      </div>
    `;
  }

  [EVENT('changRangeEditor')] (key, id) {
    var path = this.state.paths[id] || '';

    editor.selection.reset({
      'offset-path': path ? `path('${path}')` : '' 
    })

    this.emit('refreshSelectionStyleView')

  }
}
