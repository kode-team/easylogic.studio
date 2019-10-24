import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK, BIND } from "../../../util/Event";
import icon from "../icon/icon";

const MODES = {
  'segment-move': 'modify',
  'modify': 'modify',
  'draw': 'draw',
  'transform': 'transform',
} 

export default class PathManager extends UIElement {

    initState() {
        return {
            mode: 'move',
            msg: 'Keydown ESC or Enter key to close editing'
        }
    }

  template() {
    return /*html*/`
      <div class='path-manager'>
        <div class='tools' ref='$mode' data-selected-value='${this.state.mode}'>
            <button type="button" data-value='modify' title='Modify' > ${icon.device_hub}</button>
            <button type="button" data-value='draw' title='Draw' > ${icon.control_point}</button>
            <button type="button" data-value='transform' title='transform' > ${icon.format_shapes}</button>
        </div>
        <div class='split'></div>
        <div class='tools' ref='$flip'>
            <button type="button" data-value='flipX' title='flip X'>${icon.flip}</button>
            <button type="button" data-value='flipY' title='flip Y'>${icon.flip}</button>
            <button type="button" data-value='flip' title='flip origin'>${icon.flip_camera}</button>
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
    var transformType = e.$delegateTarget.attr('data-value');

    this.emit('changePathTransform', transformType);    
  }

  [CLICK('$mode button')] (e) {
    var mode = e.$delegateTarget.attr('data-value');

    this.updateData({
        mode 
    })

    this.refresh();
  }

  updateData(obj = {}) {

    this.setState(obj, false)
    this.emit(this.state.changeEvent, this.state.mode);
  }

  [EVENT('changePathManager')] (mode) {
    this.setState({ mode })
  }

  [EVENT('showPathManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changePathManager';
      this.setState(obj)
      this.$el.show();

      this.emit('addStatusBarMessage', this.state.msg)
  }

  [EVENT('hidePathManager')] () {
      this.$el.hide();
  }

  [EVENT('hideSubEditor')] () {
    this.trigger('hidePathManager');
  }  

}
