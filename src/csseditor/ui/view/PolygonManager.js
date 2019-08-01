import UIElement, { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { CLICK, BIND } from "../../../util/Event";

export default class PolygonManager extends UIElement {

    initState() {
        return {
            mode: 'move'
        }
    }

  template() {
    return `
      <div class='polygon-manager'>
        <div class='text'>
            <label>Mode</label>
            <label><input type='radio' name='polygon-mode' value='move' /> move</label>
            <label><input type='radio' name='polygon-mode' value='draw' /> draw</label>
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
      this.$el.show('inline-block');
  }

  [EVENT('hidePolygonManager')] () {
      this.$el.hide();
  }

}
