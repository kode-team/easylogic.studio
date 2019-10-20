import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { BIND, CLICK } from "../../../util/Event";


export default class SVGItemProperty extends BaseProperty {

  getTitle() {
    return "SVG Item";
  }

  getClassName() {
    return "item"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-polygon', 'svg-textpath')
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

      if (current.is('svg-path')) {
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
        <label><input type='checkbox' ref='$motionBased' ${OBJECT_TO_PROPERTY({ checked: !!current['motion-based']})} /> Is Motion Path</label>
      </div>      

      <div ref='$svgProperty'>
        <div class='property-item animation-property-item' ref='$path'>
          <span class='add-timeline-property' data-property='d'></span>      
          <label>Path - d </label>
        </div>      


        <div class='property-item animation-property-item' ref='$polygon'>
          <span class='add-timeline-property' data-property='points'></span>      
          <label>Polygon - points </label>
        </div>         

        <div class='property-item label' ref='$totalLength'>
          <label>Total Length <span ref='$length'></span></label>
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='fill'></span>
          <FillSingleEditor ref='$fill' label='Fill' key='fill' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='fill-opacity'></span>
          <NumberRangeEditor 
            ref='$fillOpacity' 
            label='Opacity' 
            key='fill-opacity' 
            removable="true"
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
          <SelectEditor 
            ref='$fillRule' 
            label='Fill Rule' 
            key="fill-rule" 
            options="nonzero,evenodd" 
            onchange="changeValue" />
        </div>            

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke'></span>
          <FillSingleEditor ref='$stroke' label='Stroke' key='stroke' onchange="changeValue" />
        </div>      

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-width'></span>
          <RangeEditor 
            ref='$strokeWidth' 
            label='Width' 
            key="stroke-width" 
            removable="true" 
            onchange="changeValue" />
        </div>
              

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-dasharray'></span>      
          <label>Dash Array</label>
        </div>
        <div class='property-item'>
          <StrokeDashArrayEditor ref='$strokeDashArray' key='stroke-dasharray' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-dashoffset'></span>      
          <NumberRangeEditor 
            ref='$strokeDashOffset' 
            key='stroke-dashoffset' 
            label='Dash Offset'
            removable="true"
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
          <SelectEditor 
            ref='$strokeLineCap' 
            label='Line Cap' 
            key="stroke-linecap" 
            options="butt,round,square" 
            onchange="changeValue" 
          />
        </div> 

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='stroke-linejoin'></span>      
          <SelectEditor 
            ref='$strokeLineJoin' 
            label='Line Join' 
            key="stroke-linejoin" 
            options="miter,arcs,bevel,miter-clip,round" 
            onchange="changeValue" 
          />
        </div>
        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='svgfilter'></span>      
          <SVGFilterSelectEditor 
            ref='$svgFilter' 
            label='Filter' 
            key="svgfilter" 
            onchange="changeValue" 
          />
        </div>         
      </div>
   
    `;
  }

  [CLICK('$motionBased')] () {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        'motion-based': this.refs.$motionBased.checked()
      })
      // this.bindData('$svgProperty')
    }

  }

  [EVENT('changeValue')] (key, value, params) {
    editor.selection.reset({ 
      [key]: value
    })
    this.emit("refreshSelectionStyleView");
  }
}
