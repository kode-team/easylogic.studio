import UIElement, { EVENT } from "@sapa/UIElement";
import { CLICK, BIND } from "@sapa/Event";
import icon from "@icon/icon";
import "../property-editor";
import { Length } from "@unit/Length";
import { registElement } from "@sapa/registerElement";

const MODES = {
  'segment-move': 'modify',
  'modify': 'modify',
  'path': 'path',
} 



export default class PathManager extends UIElement {

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


  [EVENT('refreshSelection')]() {

    var current = this.$selection.current;

    if (current) {
      this.children.$fill.setValue(current['fill'] || 'rgba(0, 0, 0, 0)')
      this.children.$stroke.setValue(current['stroke'] || 'rgba(0, 0, 0, 1)')
      this.children.$fillOpacity.setValue(current['fill-opacity'] || Length.number(1))
      this.children.$strokeWidth.setValue(current['stroke-width'] || Length.number(1))
    }

  }  

  template() {
    var current = this.$selection.current || {};    
    return /*html*/`
      <div class='path-manager'>
        <div class='tools' ref='$mode' data-selected-value='${this.state.mode}'>
            <button type="button" data-value='modify' title='${this.$i18n('path.manager.mode.modify')}' > ${icon.device_hub}</button>
            <button type="button" data-value='path' title='${this.$i18n('path.manager.mode.path')}' > ${icon.control_point}</button>
        </div>
        <div class='tools' ref='$flip'>
            <button type="button" data-value='flipX' title='${this.$i18n('path.manager.mode.flipX')}'>${icon.flip}</button>
            <button type="button" data-value='flipY' title='${this.$i18n('path.manager.mode.flipY')}'>${icon.flip}</button>
            <button type="button" data-value='flip' title='${this.$i18n('path.manager.mode.flipOrigin')}'>${icon.flip}</button>
        </div>

        <div class='tools' ref='$util'>
            <button type="button" data-value='reverse' title='${this.$i18n('path.manager.mode.transform')}' >${icon.swap_horiz}</button>
        </div>        
        <div class='tools'>      
          <div>
            <object refClass="FillSingleEditor" ref="$fill" simple="true" label="${this.$i18n('svg.item.property.fill')}" key="fill" onchange="changeValue" />
          </div>
          <div>
            <object refClass="FillSingleEditor" ref="$stroke" simple="true" label="${this.$i18n('svg.item.property.stroke')}" key="stroke" onchange="changeValue" />
          </div>      
          <div >
            <span 
              refClass="NumberInputEditor" 
              ref="$fillOpacity" 
              label="${this.$i18n('svg.item.property.fillOpacity')}" 
              key="fill-opacity" 
              value="1"
              min="0"
              max="1"
              step="0.01"
              calc="false"
              unit="number"
              onchange="changeValue"
            />
          </div>   

          <div>
            <span 
              refClass="NumberInputEditor" 
              ref="$strokeWidth" 
              label="${this.$i18n('svg.item.property.strokeWidth')}" 
              key="stroke-width" 
              onchange="changeValue"
            />
          </div>
        </div>
      </div>    
    `;
  }


  [EVENT('setColorAsset')] ({ color }) {

    if (this.$el.isShow()) {
      this.setState({
        stroke: color
      }, false)
      this.children.$stroke.setValue(color);
      this.updateData({
        stroke: color
      })      
      this.command('setAttribute', 'change color assets', { stroke: color }, null, true)    
    }

  }

  [EVENT('changeValue')] (key, value, params) {
    this.command('setAttribute', 'change path', { 
      [key]: value
    }, null, true)

    this.updateData({
      [key]: value
    })
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

    this.emit('changePathTransform', transformType);    
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

  updateData(obj = {}) {

    this.setState(obj, false)
    this.emit(this.state.changeEvent, obj);
  }

  [EVENT('changePathManager')] (mode) {
    this.setState({ mode })
  }

  [EVENT('showPathManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changePathManager';
      this.setState(obj)
      this.$el.show();

      this.emit('addStatusBarMessage', this.state.msg)
      this.emit('change.mode.view', 'PathEditorView');
  }

  [EVENT('hidePathManager')] () {
      this.$el.hide();       
  }

}

registElement({ PathManager })