
import { CLICK, BIND, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";
import { Length } from "el/editor/unit/Length";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import './PathManager.scss';

const MODES = {
  'segment-move': 'modify',
  'modify': 'modify',
  'path': 'path',
} 



export default class PathManager extends EditorElement {

  initState() {
      return {
          mode: 'move',
          fill: null,
          stroke: null,
          'fill-opacity': null,
          'stroke-width': null,
          msg: this.$i18n('path.manager.msg')
      }
  }

  template() {
    return /*html*/`
      <div class='elf--path-manager'>
        <div class="tools left" ref="$left">
            <button type="button" class="primary" data-value='PathEditorDone' title='${this.$i18n('path.manager.mode.modify')}' >Done</button>
        </div>

        <div class='tools' ref='$mode' data-selected-value='${this.state.mode}'>
            <button type="button" data-value='modify' title='${this.$i18n('path.manager.mode.modify')}' > ${iconUse("device_hub")}</button>
            <button type="button" data-value='path' title='${this.$i18n('path.manager.mode.path')}' > ${iconUse("control_point")}</button>
        </div>
        <div class='tools' ref='$util'>
            <button type="button" data-value='reverse' title='${this.$i18n('path.manager.mode.reverse')}' >${iconUse("sync")}</button>
        </div>                
        <div class='tools' ref='$flip'>
            <button type="button" data-value='flipX' title='${this.$i18n('path.manager.mode.flipX')}'>${iconUse("flip")}</button>
            <button type="button" data-value='flipY' title='${this.$i18n('path.manager.mode.flipY')}'>${iconUse("flip")}</button>
            <button type="button" data-value='flip' title='${this.$i18n('path.manager.mode.flipOrigin')}'>${iconUse("flip")}</button>
            <button type="button" data-value='2x'>2x</button>
            <button type="button" data-value='3x'>3x</button>            
        </div>
      </div>    
    `;
  }

  [BIND('$mode')] () {
    return {
      'data-selected-value' : MODES[this.state.mode]
    }
  }

  refresh() {
    this.bindData('$mode')
  }

  [CLICK('$flip button')] (e) {
    var transformType = e.$dt.attr('data-value');

    if (transformType === '2x') {
      this.emit('divideSegmentsByCount', 2);  
    } else if (transformType === '3x') {
        this.emit('divideSegmentsByCount', 3);        
    } else {
      this.emit('changePathTransform', transformType);    
    }
  }

  [CLICK('$util button')] (e) {
    var utilType = e.$dt.attr('data-value');

    this.emit('changePathUtil', utilType);    
  }  

  [CLICK('$mode button')] (e) {
    var mode = e.$dt.attr('data-value');

    this.updateData({
        mode 
    })

    this.refresh();
  }

  [CLICK('$left button')] (e) {
    var message = e.$dt.attr('data-value');

    this.emit(message);  
  }  

  updateData(obj = {}) {

    this.setState(obj, false)
    this.emit(this.state.changeEvent, obj);
  }

  [SUBSCRIBE('changePathManager')] (mode) {
    this.setState({ mode })
  }

  [SUBSCRIBE('showPathManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changePathManager';
      this.setState(obj)
      this.$el.show();

      this.emit('addStatusBarMessage', this.state.msg)
  }

  [SUBSCRIBE('hidePathManager')] () {
      this.$el.hide();       
  }

}