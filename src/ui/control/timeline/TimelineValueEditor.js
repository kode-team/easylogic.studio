import UIElement, { EVENT } from "@core/UIElement";
import { CLICK, KEYDOWN, KEYUP, IF, PREVENT, ENTER } from "@core/Event";

import CubicBezierEditor from "@ui/property-editor/CubicBezierEditor";
import CSSPropertyEditor from "@ui/property-editor/CSSPropertyEditor";

import { second, timecode } from "@core/functions/time";
import { isUndefined } from "@core/functions/func";
import icon from "@icon/icon";

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
      timing: 'linear',
      selectedIndex: 1  

    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.parent.trigger(this.props.onchange, this.state);
  }

  getProperties() {
    return [{
        key: this.state.property,
        value: isUndefined(this.state.value) ? '10px' : this.state.value ,
        editor: this.state.editor
    }].filter(it => it.key);
  }

  refresh () {

    var project = this.$selection.currentProject; 
    var code = '00:00:00:00';
    if (project) {
      var timeline = project.getSelectedTimeline();
      if (timeline) {
        code = timecode(timeline.fps, this.state.time)
      }
    }

    this.refs.$offsetTime.val(code)
    this.children.$propertyEditor.trigger('showCSSPropertyEditor', this.getProperties());      
    this.children.$cubicBezierEditor.trigger('showCubicBezierEditor', this.state.timing);
  }

  template() {
    return /*html*/`
    <div class='timeline-value-editor'>
        <div class="tab number-tab" ref="$tab">
            <div class="tab-header full" ref="$header">
                <div class="tab-item selected" data-value="1">
                    <label>${this.$i18n('timeline.value.editor.value')}</label>
                </div>          
                <div class="tab-item" data-value="2">
                    <label>${this.$i18n('timeline.value.editor.timing')}</label> 
                </div>                            
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content selected padding-zero" data-value="1">
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


  [CLICK("$header .tab-item")](e) {
    var selectedIndex = +e.$dt.attr('data-value')
    if (this.state.selectedIndex === selectedIndex) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedIndex}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedIndex}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedIndex }, false);

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

[KEYUP('$offsetTime') + ENTER + IF('checkNumberOrTimecode') + PREVENT] (e) {
    var frame = this.refs.$offsetTime.value

    var project = this.$selection.currentProject;
    if (project) {
      var timeline = project.getSelectedTimeline();

      this.updateData({
        time: second(timeline.fps, frame)
      });
    }

}


  templateForOffset() {
    return /*html*/`
      <div class='offset-input'>
        <label>${this.$i18n('timeline.value.editor.time')}</label>
        <div class='input-area'>
          <input type="text" ref='$offsetTime' title="${this.$i18n('timeline.value.editor.offset.message')}" />
        </div>
        <button type="button" ref='$seek' title='Seek timeline'>${icon.gps_fixed}</button>
      </div>
    `
  }    

  [CLICK('$seek')] () {
    var project = this.$selection.currentProject;

    if (project) {
      project.seek(this.refs.$offsetTime.value, (it => {

        if ( it.layer.id === this.state.layerId && it.property === this.state.property) {
          return true; 
        }

        return false; 
      }))
      this.emit('playTimeline');
    }
  }

  templateForProperty() {
    return /*html*/`
      <CSSPropertyEditor ref='$propertyEditor' hide-title='true' onchange='changePropertyEditor' />
    `
  }    

  templateForTimingFunction () {
    return /*html*/`
    <div class='timing-function'>
      <CubicBezierEditor ref='$cubicBezierEditor' key="timing" value="${this.state.timingFunction || 'linear'}" onChange='changeCubicBezier' />
    </div>
    `
  }

  [EVENT('refreshPropertyValue')] () {

    var project = this.$selection.currentProject;
    if (project) {
      var selectedLayer = project.searchById(this.state.layerId); 

      if (selectedLayer) {
        var value = selectedLayer[this.state.property] + ''
        this.trigger('refreshOffsetValue', { value })
        this.updateData({ value })
      }
    }
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
