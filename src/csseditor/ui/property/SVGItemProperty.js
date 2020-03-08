import BaseProperty from "./BaseProperty";
import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { BIND, CLICK } from "../../../util/Event";

export default class SVGItemProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('svg.item.property.title');
  }

  getClassName() {
    return "item"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-polygon', 'svg-textpath', 'svg-text')
  }


  [EVENT('refreshPathLayer', 'refreshPolygonLayer', 'refreshStyleView')]() {

    var current = this.$selection.current;

    if (current && this.isSVGItem(current)) {

      this.refs.$length.text(current.totalLength);
    }

  }  

  [EVENT('refreshSelection')]() {

    var current = this.$selection.current;

    if (current && this.isSVGItem(current)) {

      if (this.$el.css('display') === 'none') {
        this.$el.show();
      }

      if (current.is('svg-path', 'svg-textpath')) {
        this.refs.$path.show();
        this.refs.$totalLength.show();
        this.refs.$polygon.hide();        

      } else if (current.is('svg-polygon')) {
        this.refs.$path.hide();
        this.refs.$polygon.show();
        this.refs.$totalLength.show();        

      } else {
        this.refs.$path.hide();
        this.refs.$polygon.hide();
        this.refs.$totalLength.hide();        
      }

      this.refs.$length.text(current.totalLength);
      this.children.$fill.setValue(current['fill'] || 'rgba(0, 0, 0, 0)')
      this.children.$stroke.setValue(current['stroke'] || 'rgba(0, 0, 0, 1)')
      this.children.$fillOpacity.setValue(current['fill-opacity'] || Length.number(1))
      this.children.$strokeWidth.setValue(current['stroke-width'] || Length.number(1))
      this.children.$fillRule.setValue(current['fill-rule'] || 'nonzero')
      this.children.$strokeDashOffset.setValue(current['stroke-dashoffset'] || Length.number(0))
      this.children.$strokeDashArray.setValue(current['stroke-dasharray'] || ' ')
      this.children.$strokeLineCap.setValue(current['stroke-linecap'] || 'butt')
      this.children.$strokeLineJoin.setValue(current['stroke-linejoin'] || 'miter')

    } else {
      this.$el.hide();
    }

  }

  refresh() {
    // update 를 어떻게 할지 고민 
  }

  [BIND('$svgProperty')] () {
    var current = this.$selection.current || {};
    var isMotionBased = !!current['motion-based']
    return {
      style: {
        display: isMotionBased ? 'none': 'block'
      }
    }
  }

  getBody() {
    var current = this.$selection.current || {};

    return /*html*/`

      <div class='property-item'> 
        <label>
          <input type='checkbox' ref='$motionBased' ${OBJECT_TO_PROPERTY({ checked: !!current['motion-based']})} /> 
          ${this.$i18n('svg.item.property.isMotionPath')}
        </label>
      </div>      

      <div ref='$svgProperty'>
        <div class='property-item animation-property-item' ref='$path'>
          <span class='add-timeline-property' data-property='d'></span>      
          <label>${this.$i18n('svg.item.property.path')} - d </label>
        </div>      


        <div class='property-item animation-property-item' ref='$polygon'>
          <span class='add-timeline-property' data-property='points'></span>      
          <label>${this.$i18n('svg.item.property.polygon')} - points </label>
        </div>         

        <div class='property-item label' ref='$totalLength'>
          <label>${this.$i18n('svg.item.property.totalLength')} <span ref='$length'></span></label>
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='fill'></span>
          <FillSingleEditor ref='$fill' label='${this.$i18n('svg.item.property.fill')}' key='fill' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='fill-opacity'></span>
          <NumberRangeEditor 
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


        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='fill-rule'></span>
          <SelectIconEditor 
            ref='$fillRule' 
            label='${this.$i18n('svg.item.property.fillRule')}' 
            key="fill-rule" 
            options="nonzero,evenodd" 
            onchange="changeValue" />
        </div>            

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke'></span>
          <FillSingleEditor ref='$stroke' label='${this.$i18n('svg.item.property.stroke')}' key='stroke' onchange="changeValue" />
        </div>      

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-width'></span>
          <RangeEditor 
            ref='$strokeWidth' 
            label='${this.$i18n('svg.item.property.strokeWidth')}' 
            key="stroke-width" 
            onchange="changeValue" />
        </div>
              

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-dasharray'></span>      
          <label>${this.$i18n('svg.item.property.dashArray')}</label>
        </div>
        <div class='property-item'>
          <StrokeDashArrayEditor ref='$strokeDashArray' key='stroke-dasharray' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-dashoffset'></span>      
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

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-linecap'></span>      
          <SelectIconEditor 
            ref='$strokeLineCap' 
            label='${this.$i18n('svg.item.property.lineCap')}' 
            key="stroke-linecap" 
            options="butt,round,square" 
            onchange="changeValue" 
          />
        </div> 

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-linejoin'></span>      
          <span>${this.$i18n('svg.item.property.lineJoin')}</span>
        </div>
        <div class='property-item'>
          <SelectIconEditor 
            ref='$strokeLineJoin' 
            key="stroke-linejoin" 
            options="miter,arcs,bevel,miter-clip,round" 
            onchange="changeValue" 
          />
        </div>        
        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='svgfilter'></span>      
          <SVGFilterSelectEditor 
            ref='$svgFilter' 
            label='${this.$i18n('svg.item.property.filter')}' 
            key="svgfilter" 
            onchange="changeValue" 
          />
        </div>         
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
