import UIElement, { EVENT } from "../../../../util/UIElement";
import CubicBezierEditor from "../../property-editor/CubicBezierEditor";
import { LOAD, CLICK } from "../../../../util/Event";
import CSSPropertyEditor from "../../property-editor/CSSPropertyEditor";
import { Length } from "../../../../editor/unit/Length";



export default class TimelineValueEditor extends UIElement {
  components() {
    return {
      CSSPropertyEditor,
      CubicBezierEditor
    }
  }

  initState() {
    return {
      key: '',
      value: '',
      timingFunction: 'ease'
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.parent.trigger(this.props.onchange, opt);
  }

  setTimingFunction (timingFunction) {
      this.setState({timingFunction}, false);
      this.refresh();
  }

  getProperties() {
    return [{
        key: this.state.key,
        value: this.state.value || Length.px(10)
    }].filter(it => it.key);
  }

  refresh () {
    this.children.$propertyEditor.trigger('showCSSPropertyEditor', this.getProperties());      
    this.children.$cubicBezierEditor.trigger('showCubicBezierEditor', this.state);
  }

  template() {
    return /*html*/`
    <div class='timeline-value-editor'>
        <div class="tab number-tab" data-selected-value="1" ref="$tab">
            <div class="tab-header" ref="$header">
                <div class="tab-item" data-value="1">
                    <label>Value</label>
                </div>          
                <div class="tab-item" data-value="2">
                    <label>Timing</label>
                </div>
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content padding-zero" data-value="1">
                    ${this.templateForProperty()}  
                </div>
                <div class="tab-content" data-value="2">
                    ${this.templateForTimingFunction()}
                </div>
            </div>
        </div>
    </div>
    `;
  }


  [CLICK("$header .tab-item")](e) {
    this.refs.$tab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
    this.refresh();
  }

  templateForProperty() {
    return `<CSSPropertyEditor ref='$propertyEditor' hide-title='true' onchange='changePropertyEditor' />`
  }    

  [LOAD('$editor')] () {
      return ''
  }

  templateForTimingFunction () {
    return /*html*/`
    <div class='timing-function'>
      <CubicBezierEditor ref='$cubicBezierEditor' key="timing" value="${this.state.timingFunction}" onChange='changeCubicBezier' />
    </div>
    `
  }

  [EVENT('refreshOffsetValue')] (key, value, timingFunction) {
    this.setState({
        key, 
        value, 
        timingFunction 
    }, false)
    this.refresh();
  }

  [EVENT('changeCubicBezier')] (key, value) {
    this.updateData({ [key]: value + '' })
  }

  [EVENT('changePropertyEditor')] (obj) {

    if (obj.length)  {
        var it = obj[0]
        this.updateData({
            value: it.value + ''
        })
    }
  }

}
