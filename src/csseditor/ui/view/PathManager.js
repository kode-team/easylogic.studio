import UIElement, { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { CLICK, BIND } from "../../../util/Event";

export default class PathManager extends UIElement {

    initState() {
        return {
            mode: 'move'
        }
    }

  template() {
    return `
      <div class='path-manager'>
        <div class='text'>
            <label>Mode</label>
            <label><input type='radio' name='path-mode' value='move' /> move</label>
            <label><input type='radio' name='path-mode' value='draw' /> draw</label>
        </div>
      </div>    
    `;
  }

  refresh() {
    var $mode = this.$el.$(`[value=${this.state.mode}]`)
    
    if ($mode) {
      $mode.checked(true);
    }
  }

  [CLICK('$el input[type="radio"]')] (e) {
    var mode = e.$delegateTarget.value;

    this.updateData({
        mode 
    })
  }

  updateData(obj = {}) {

    this.setState(obj, false)
    this.emit(this.state.changeEvent, this.state.mode);
  }

  [EVENT('changePathManager')] (mode) {
    this.setState({ mode }, false)
    this.refresh();    
  }

  [EVENT('showPathManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changePathManager';
      this.setState(obj, false)
      this.refresh();
      this.$el.show('inline-block');
  }

  [EVENT('hidePathManager')] () {
      this.$el.hide();
  }

}
