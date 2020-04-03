import UIElement, { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { CLICK } from "../../../util/Event";
import propertyEditor from "../property-editor";

export default class SVGItemEditor extends UIElement {

  components() {
    return propertyEditor
  }

  [EVENT('refreshSelection')]() {

    var current = this.$selection.current;

    if (current) {
      this.children.$fill.setValue(current['fill'] || 'rgba(0, 0, 0, 0)')
      this.children.$stroke.setValue(current['stroke'] || 'rgba(0, 0, 0, 1)')
      this.children.$fillOpacity.setValue(current['fill-opacity'] || Length.number(1))
      this.children.$strokeWidth.setValue(current['stroke-width'] || Length.number(1))
      this.children.$fillRule.setValue(current['fill-rule'] || 'nonzero')
      // this.children.$strokeDashOffset.setValue(current['stroke-dashoffset'] || Length.number(0))
      // this.children.$strokeDashArray.setValue(current['stroke-dasharray'] || ' ')
      // this.children.$strokeLineCap.setValue(current['stroke-linecap'] || 'butt')
      // this.children.$strokeLineJoin.setValue(current['stroke-linejoin'] || 'miter')

    }

  }

  refresh() {
    // update 를 어떻게 할지 고민 
  }

  template() {
    var current = this.$selection.current || {};

    return /*html*/`
      <div class='svg-item-editor'>
        <div> 
          <label>
            <input type='checkbox' ref='$motionBased' ${OBJECT_TO_PROPERTY({ checked: !!current['motion-based']})} /> 
            ${this.$i18n('svg.item.property.isMotionPath')}
          </label>
        </div>           
        <div >
          <FillSingleEditor ref='$fill' label='${this.$i18n('svg.item.property.fill')}' key='fill' onchange="changeValue" />
        </div>

        <div >
          <NumberInputEditor 
            ref='$fillOpacity' 
            label='${this.$i18n('svg.item.property.fillOpacity')}' 
            key='fill-opacity' 
            value="1" 
            min="0"
            max="1"
            step="0.01"
            calc="false"
            unit="number" 
            onchange="changeValue" 
            />
        </div>   


        <div >
          <SelectIconEditor 
            ref='$fillRule' 
            label='${this.$i18n('svg.item.property.fillRule')}' 
            key="fill-rule" 
            options="nonzero,evenodd" 
            onchange="changeValue" />
        </div>            

        <div >
          <FillSingleEditor ref='$stroke' label='${this.$i18n('svg.item.property.stroke')}' key='stroke' onchange="changeValue" />
        </div>      

        <div >
          <NumberInputEditor 
            ref='$strokeWidth' 
            label='${this.$i18n('svg.item.property.strokeWidth')}' 
            key="stroke-width" 
            onchange="changeValue" />
        </div>
              
      <!--
        <div >
          <label>${this.$i18n('svg.item.property.dashArray')}</label>
        </div>
        <div >
          <StrokeDashArrayEditor ref='$strokeDashArray' key='stroke-dasharray' onchange="changeValue" />
        </div>

        <div >
          <NumberRangeEditor 
            ref='$strokeDashOffset' 
            key='stroke-dashoffset' 
            label='${this.$i18n('svg.item.property.dashOffset')}'
            value="0" 
            min="-1000"
            max="1000"
            step="1"
            calc="false"
            unit="number" 
            onchange="changeValue" 
            />
        </div>         

        <div >
          <SelectIconEditor 
            ref='$strokeLineCap' 
            label='${this.$i18n('svg.item.property.lineCap')}' 
            key="stroke-linecap" 
            options="butt,round,square" 
            onchange="changeValue" 
          />
        </div> 
        <div >
          <SelectIconEditor 
            ref='$strokeLineJoin' 
            label='${this.$i18n('svg.item.property.lineJoin')}'             
            key="stroke-linejoin" 
            options="miter,bevel,round" 
            onchange="changeValue" 
          />
        </div>        
        <div >
          <SVGFilterSelectEditor 
            ref='$svgFilter' 
            label='${this.$i18n('svg.item.property.filter')}' 
            key="svgfilter" 
            onchange="changeValue" 
          />
        </div>     -->    
      </div>
   
    `;
  }

  [CLICK('$motionBased')] () {
    this.emit('setAttribute', { 
      'motion-based': this.refs.$motionBased.checked()
    })      
  }

  [EVENT('changeValue')] (key, value, params) {
    this.emit('setAttribute', { 
      [key]: value
    }, null, true)
  }
}
