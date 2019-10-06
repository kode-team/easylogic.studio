import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK } from "../../../util/Event";

export default class PolygonManager extends UIElement {

  initState() {
      return {
          mode: 'move',
          msg: 'Keydown ESC or Enter key to close editing'
      }
  }

  template() {
    return /*html*/`
      <div class='polygon-manager'>
        <div class='text'>
            <label>Polygon Mode</label>
            <label><input type='radio' name='polygon-mode' value='draw' /> draw</label>            
            <label><input type='radio' name='polygon-mode' value='modify' /> modify</label>         
        </div>
      </div>    
    `;
  }

  [CLICK('$el input[type="radio"]')] (e) {
    var mode = e.$delegateTarget.value;

    this.updateData({
        mode 
    })
  }


  refresh() {
    var $mode = this.$el.$(`[value=${this.state.mode}]`)
    
    if ($mode) {
      $mode.checked(true);
    }
  }

  updateData(obj = {}) {

    this.setState(obj, false)
    this.emit(this.state.changeEvent, this.state.mode);
  }

  [EVENT('changePolygonManager')] (mode) {
    this.setState({ mode }, false)

    this.refresh();
  }

  [EVENT('showPolygonManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changePolygonManager';
      this.setState(obj, false)
      this.refresh();
      this.$el.show();
      this.emit('addStatusBarMessage', this.state.msg)      
  }

  [EVENT('hidePolygonManager')] () {
      this.$el.hide();
  }

  [EVENT('hideSubEditor')] () {
    this.trigger('hidePolygonManager');
  }

}
