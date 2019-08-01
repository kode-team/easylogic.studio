import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";


export default class SVGItemProperty extends BaseProperty {

  getTitle() {
    return "SVG Item";
  }

  getClassName() {
    return "item"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-polygon')
  }

  [EVENT('refreshSelection')]() {

    var current = editor.selection.current;

    if (current && this.isSVGItem(current)) {

      if (this.$el.css('display') === 'none') {
        this.$el.show();
      }

      this.children.$fill.setValue(current['fill'] || 'rgba(0, 0, 0, 0)')
      this.children.$stroke.setValue(current['stroke'] || 'rgba(0, 0, 0, 1)')
      this.children.$fillOpacity.setValue(current['fill-opacity'] || Length.number(1))
      this.children.$strokeWidth.setValue(current['stroke-width'] || Length.number(1))
      this.children.$fillRule.setValue(current['fill-rule'] || 'nonzero')
      this.children.$strokeDashOffset.setValue(current['stroke-dashoffset'] || Length.number(0))
      this.children.$strokeLineCap.setValue(current['stroke-linecap'] || 'butt')
      this.children.$strokeLineJoin.setValue(current['stroke-linejoin'] || 'miter')

    } else {
      this.$el.hide();
    }

  }

  refresh() {
    // update 를 어떻게 할지 고민 
  }

  getBody() {
    return `

      <div class='property-item label'>
        <label>Fill</label>
      </div>

      <div class='property-item'>
        <ColorViewEditor ref='$fill' label='Color' params='fill' onchange="changeColor" />
      </div>


      <div class='property-item'>

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
          onchange="changeRangeEditor" 
          />
      </div>   


      <div class='property-item'>
        <SelectEditor 
          ref='$fillRule' 
          label='Fill Rule' 
          key="fill-rule" 
          options="nonzero,evenodd" 
          onchange="changeRangeEditor" />
      </div>            

      <div class='property-item label'>
        <label>Stroke</label>
      </div>      

      <div class='property-item'>
        <ColorViewEditor ref='$stroke' label='Color' params='stroke' onchange="changeColor" />
      </div>      

      <div class='property-item'>
        <RangeEditor 
          ref='$strokeWidth' 
          label='Width' 
          key="stroke-width" 
          removable="true" 
          onchange="changeRangeEditor" />
      </div>
            

      <div class='property-item'>
        <label>Dash Array</label>

        <NumberRangeEditor 
          ref='$strokeDashArray1' 
          label='1' 
          key='stroke-dasharray' 
          params='1'
          removable="true"
          value="0" 
          min="0"
          max="1000"
          step="1"
          calc="false"
          unit="number" 
          onchange="changeRangeEditor" 
          />

        <NumberRangeEditor 
          ref='$strokeDashArray2' 
          label='2' 
          key='stroke-dasharray' 
          params='2'
          removable="true"
          value="0" 
          min="0"
          max="1000"
          step="1"
          calc="false"
          unit="number" 
          onchange="changeRangeEditor" 
          />
      </div>

      <div class='property-item'>
        <label>Dash Offset</label>
        <NumberRangeEditor 
          ref='$strokeDashOffset' 
          key='stroke-dashoffset' 
          removable="true"
          value="0" 
          min="-1000"
          max="1000"
          step="1"
          calc="false"
          unit="number" 
          onchange="changeRangeEditor" 
          />
      </div>         

      <div class='property-item'>
        <SelectEditor 
          ref='$strokeLineCap' 
          label='Line Cap' 
          key="stroke-linecap" 
          options="butt,round,square" 
          onchange="changeRangeEditor" 
        />
      </div> 

      <div class='property-item'>
        <SelectEditor 
          ref='$strokeLineJoin' 
          label='Line Join' 
          key="stroke-linejoin" 
          options="miter,arcs,bevel,miter-clip,round" 
          onchange="changeRangeEditor" 
        />
      </div> 

    `;
  }


  [EVENT('changeColor')] (color, params) {
    this.trigger('changeRangeEditor', params, color);
  }

  [EVENT('changeRangeEditor')] (key, value, params) {

    if (key === 'stroke-dasharray') {
      if (params === '1') {
        editor.selection.reset({ 
          [key]: [ value, editor.selection.current['stroke-dasharray'][1] ]
        })        
      } else if (params === '2') {
        editor.selection.reset({ 
          [key]: [ editor.selection.current['stroke-dasharray'][1], value ]
        })        
      }
    } else {
      editor.selection.reset({ 
        [key]: value
      })
    }


    this.emit("refreshSelectionStyleView");
  }
}
