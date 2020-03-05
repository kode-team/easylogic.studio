import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { BIND, CLICK } from "../../../util/Event";

const i18n = editor.initI18n('svg.item.property');

export default class SVGItemProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
  }

  getClassName() {
    return "item"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-polygon', 'svg-textpath', 'svg-text')
  }


  [EVENT('refreshPathLayer', 'refreshPolygonLayer', 'refreshStyleView')]() {

    var current = editor.selection.current;

    if (current && this.isSVGItem(current)) {

      this.refs.$length.text(current.totalLength);
    }

  }  

  [EVENT('refreshSelection')]() {

    var current = editor.selection.current;

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
    var current = editor.selection.current || {};
    var isMotionBased = !!current['motion-based']
    return {
      style: {
        display: isMotionBased ? 'none': 'block'
      }
    }
  }

  getBody() {
    var current = editor.selection.current || {};

    return /*html*/`

      <div class='property-item'> 
        <label>
          <input type='checkbox' ref='$motionBased' ${OBJECT_TO_PROPERTY({ checked: !!current['motion-based']})} /> 
          ${i18n('isMotionPath')}
        </label>
      </div>      

      <div ref='$svgProperty'>
        <div class='property-item animation-property-item' ref='$path'>
          <span class='add-timeline-property' data-property='d'></span>      
          <label>${i18n('path')} - d </label>
        </div>      


        <div class='property-item animation-property-item' ref='$polygon'>
          <span class='add-timeline-property' data-property='points'></span>      
          <label>${i18n('polygon')} - points </label>
        </div>         

        <div class='property-item label' ref='$totalLength'>
          <label>${i18n('totalLength')} <span ref='$length'></span></label>
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='fill'></span>
          <FillSingleEditor ref='$fill' label='${i18n('fill')}' key='fill' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='fill-opacity'></span>
          <NumberRangeEditor 
            ref='$fillOpacity' 
            label='${i18n('fillOpacity')}' 
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
            label='${i18n('fillRule')}' 
            key="fill-rule" 
            options="nonzero,evenodd" 
            onchange="changeValue" />
        </div>            

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke'></span>
          <FillSingleEditor ref='$stroke' label='${i18n('stroke')}' key='stroke' onchange="changeValue" />
        </div>      

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-width'></span>
          <RangeEditor 
            ref='$strokeWidth' 
            label='${i18n('strokeWidth')}' 
            key="stroke-width" 
            onchange="changeValue" />
        </div>
              

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-dasharray'></span>      
          <label>${i18n('dashArray')}</label>
        </div>
        <div class='property-item'>
          <StrokeDashArrayEditor ref='$strokeDashArray' key='stroke-dasharray' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-dashoffset'></span>      
          <NumberRangeEditor 
            ref='$strokeDashOffset' 
            key='stroke-dashoffset' 
            label='${i18n('dashOffset')}'
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
            label='${i18n('lineCap')}' 
            key="stroke-linecap" 
            options="butt,round,square" 
            onchange="changeValue" 
          />
        </div> 

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-linejoin'></span>      
          <span>${i18n('lineJoin')}</span>
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
            label='${i18n('filter')}' 
            key="svgfilter" 
            onchange="changeValue" 
          />
        </div>         
      </div>
   
    `;
  }

  [CLICK('$motionBased')] () {
    this.emit('SET_ATTRIBUTE', { 
      'motion-based': this.refs.$motionBased.checked()
    })      
  }

  [EVENT('changeValue')] (key, value, params) {
    this.emit('SET_ATTRIBUTE', { 
      [key]: value
    }, null, true)
  }
}
