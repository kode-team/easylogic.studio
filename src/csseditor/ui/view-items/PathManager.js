import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK, BIND } from "../../../util/Event";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";

const MODES = {
  'segment-move': 'modify',
  'modify': 'modify',
  'draw': 'draw',
  'transform': 'transform',
} 

const i18n = editor.initI18n('path.manager');

export default class PathManager extends UIElement {

    initState() {
        return {
            mode: 'move',
            msg: i18n('msg')
        }
    }

  template() {
    return /*html*/`
      <div class='path-manager'>
        <div class='tools' ref='$mode' data-selected-value='${this.state.mode}'>
            <button type="button" data-value='modify' title='${i18n('mode.modify')}' > ${icon.device_hub}</button>
            <button type="button" data-value='draw' title='${i18n('mode.draw')}' > ${icon.control_point}</button>
            <button type="button" data-value='transform' title='${i18n('mode.transform')}' > ${icon.format_shapes}</button>
        </div>
        <div class='split'></div>
        <div class='tools' ref='$flip'>
            <button type="button" data-value='flipX' title='${i18n('mode.flipX')}'>${icon.flip}</button>
            <button type="button" data-value='flipY' title='${i18n('mode.flipY')}'>${icon.flip}</button>
            <button type="button" data-value='flip' title='${i18n('mode.flipOrigin')}'>${icon.flip}</button>
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
