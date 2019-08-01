import UIElement, { EVENT } from "../../../util/UIElement";
import { editor } from "../../../editor/editor";
import { Transform } from "../../../editor/css-property/Transform";
import RangeEditor from "../property-editor/RangeEditor";
import { Length } from "../../../editor/unit/Length";
import { DEBOUNCE } from "../../../util/Event";



export default class SelectionManager extends UIElement {

  components() {
    return {
      RangeEditor
    }
  }


  template() {
    return `
      <div class='selection-manager'>
        <div class='text'>
            <label>
              <RangeEditor ref='$perspective' label='perspective' key='perspective' min="0" max="1000" units='px' onChange="changeRangeEditor" />
            </label>
        </div>
      </div>    
    `;
  }

  [EVENT('changeRangeEditor') + DEBOUNCE(100)] (key, value) {


    editor.selection.items.forEach(current => {
      var transformObj = Transform.parseStyle(current.transform); 
     
      var perspective = transformObj.filter(it => it.type === 'perspective')[0];
      
      if (perspective) {
        perspective.value[0] = value; 
      } else {
        transformObj.push({type: 'perspective', value: [value]})
      }

      current.reset({
        transform: Transform.join(transformObj)
      })
    })

    this.emit('initSelectionTool');
    this.emit('refreshSelectionStyleView');
  }

  refresh() {

    var current = editor.selection.current;

    if (current) {
      var transformObj = Transform.parseStyle(current.transform); 

      var perspective = transformObj.filter(it => it.type === 'perspective')[0];

      if (perspective) {
        this.children.$perspective.setValue(perspective.values[0]);
      } else {
        this.children.$perspective.setValue(Length.px(0));
      }

    }
  }

  [EVENT('showSelectionManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changeSelectionManager';
      // this.setState(obj, false)
      // this.refresh();
      this.$el.show('inline-block');
  }

  [EVENT('hideSelectionManager')] () {
      this.$el.hide();
  }

}
