import UIElement, { EVENT } from "../../../../util/UIElement";
import CubicBezierEditor from "../../property-editor/CubicBezierEditor";
import { LOAD, CLICK, KEYDOWN, KEYUP, KEY, IF, PREVENT } from "../../../../util/Event";
import CSSPropertyEditor from "../../property-editor/CSSPropertyEditor";
import { Length } from "../../../../editor/unit/Length";
import { second, framesToTimecode, timecode } from "../../../../util/functions/time";
import { editor } from "../../../../editor/editor";
import { isUndefined } from "../../../../util/functions/func";



export default class TimelineValueEditor extends UIElement {
  components() {
    return {
      CSSPropertyEditor,
      CubicBezierEditor
    }
  }

  initState() {
    return {
      time: 0,
      timing: 'linear'
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.parent.trigger(this.props.onchange, this.state);
  }

  getProperties() {
    return [{
        key: this.state.property,
        value: isUndefined(this.state.value) ? '10px' : this.state.value 
    }].filter(it => it.key);
  }

  refresh () {

    var artboard = editor.selection.currentArtboard; 
    var code = '00:00:00:00';
    if (artboard) {
      var timeline = artboard.getSelectedTimeline();
      if (timeline) {
        code = timecode(timeline.fps, this.state.time)
      }
    }

    this.refs.$offsetTime.val(code)
    this.children.$propertyEditor.trigger('showCSSPropertyEditor', this.getProperties());      
    this.children.$cubicBezierEditor.trigger('showCubicBezierEditor', {
      timingFunction: this.state.timing
    });
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
                <div class='tab-item empty-item'></div>
                <div class='tab-item empty-item'></div>
                <div class='tab-item empty-item'></div>                                
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content padding-zero" data-value="1">
                    ${this.templateForOffset()}  
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


  [CLICK("$header .tab-item:not(.empty-item)")](e) {
    this.refs.$tab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
    this.refresh();
  }


  checkNumberOrTimecode (e) {
    var value = e.target.value.trim();
    if ((+value) + '' === value) {
        return true; 
    } else if (value.match(/^[0-9:]+$/)) {
        return true; 
    }

    return false;
}

checkKey (e) {
    if (e.key.match(/^[0-9:]+$/)) {
        return true; 
    } else if (e.code === 'Backspace' || e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        return true; 
    }

    return false; 
}

[KEYDOWN('$offsetTime')] (e) {
    if (!this.checkKey(e)) {
        e.preventDefault();
        e.stopPropagation()
        return false;
    }
}

[KEYUP('$offsetTime') + KEY('Enter') + IF('checkNumberOrTimecode') + PREVENT] (e) {
    var frame = this.refs.$currentTime.value

    this.updateData({
      time: second(frame)
    });

}


  templateForOffset() {
    return `
      <div class='offset-input'>
        <label>Time</label>
        <input type="text" ref='$offsetTime' />
      </div>
    `
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

  [EVENT('refreshOffsetValue')] (offset) {
    this.setState({
        ...offset
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
