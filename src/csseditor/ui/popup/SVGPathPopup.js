import { EVENT } from "../../../util/UIElement";
import { INPUT, LOAD, BIND } from "../../../util/Event";
import BasePopup from "./BasePopup";
import SVGItemProperty from "../property/SVGItemProperty";

export default class SVGPathPopup extends BasePopup {

  getTitle() {
    return 'SVG Path Editor';
  }

  components() {
    return {
      // SVGPathEditor
      SVGItemProperty
    }
  }

  initState() {
    return {
      changeEvent: 'changeSVGPathPopup',
      id: '',
      filters: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit(this.state.changeEvent, this.state);
  }

  getBody() {
    return `
    <div class='svg-path-editor-popup' ref='$popup'>
      <div class='box editor' ref='$editor'>

      </div>    
      <div class="box inspector">
        <SVGItemProperty ref='$property' />
      </div>

    </div>`;
  }

  [LOAD('$editor')] () {

    return `
      <SVGPathEditor ref='$pathEditor' key="d" d="${this.state.d}" onchange='changeFilterEditor' />
    `

  }

  [EVENT('changeFilterEditor')] (key, value) {
    this.updateData({
      [key]: value 
    })
  }


  [EVENT("showSVGPathPopup")](data) {

    this.setState(data);
    // this.refresh()

    this.show(600);
  }

  [EVENT("hideSVGPathPopup")]() {
    this.$el.hide();
  }
}
