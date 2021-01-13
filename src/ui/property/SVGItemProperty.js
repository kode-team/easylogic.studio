import BaseProperty from "./BaseProperty";
import { EVENT } from "@core/UIElement";
import { Length } from "@unit/Length";
import { BIND, CLICK, THROTTLE } from "@core/Event";

export default class SVGItemProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('svg.item.property.title');
  }

  getClassName() {
    return "item"
  }

  isSVGItem  (current) {
    return current.is('svg-path', 'svg-brush', 'svg-polygon', 'svg-textpath', 'svg-text')
  }


  [EVENT('refreshStyleView', 'refreshRect', 'refreshCanvasForPartial', 'updatePathItem') + THROTTLE(100)]() {

    var current = this.$selection.current;

    if (current && this.isSVGItem(current)) {

      this.refs.$length.text(Math.floor(current.totalLength) || '');
    }

  }  

  [EVENT('refreshSelection')]() {

    var current = this.$selection.current;

    if (current && this.isSVGItem(current)) {

      if (this.$el.isHide()) {
        this.$el.show();
      }

      this.refs.$length.text(current.totalLength || '');
      this.children.$fill.setValue(current['fill'] || 'rgba(0, 0, 0, 0)')
      this.children.$stroke.setValue(current['stroke'] || 'rgba(0, 0, 0, 1)')
      this.children.$fillOpacity.setValue(current['fill-opacity'] || Length.number(1))
      this.children.$strokeWidth.setValue(current['stroke-width'] || Length.number(1))
      this.children.$fillRule.setValue(current['fill-rule'] || 'nonzero')
      this.children.$strokeDashOffset.setValue(current['stroke-dashoffset'] || Length.number(0))
      this.children.$strokeDashArray.setValue(current['stroke-dasharray'] || ' ')
      this.children.$strokeLineCap.setValue(current['stroke-linecap'] || 'butt')
      this.children.$strokeLineJoin.setValue(current['stroke-linejoin'] || 'miter')
      this.children.$mixBlend.setValue(current['mix-blend-mode'])      

    } else {
      this.$el.hide();
    }

  }

  refresh() {
    // update 를 어떻게 할지 고민 
  }

  getBody() {
    var current = this.$selection.current || {};

    return /*html*/`
      <div ref='$svgProperty'>
        <div class='property-item animation-property-item' ref='$path'>
          <div class='group'>
            <span class='add-timeline-property' data-property='d'></span>      
          </div>            
          <label>${this.$i18n('svg.item.property.path')} - <span>${this.$i18n('svg.item.property.totalLength')}</span> <span ref='$length'></span> </label>
        </div>      

        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='fill'></span>
          </div>
          <FillSingleEditor ref='$fill' label='${this.$i18n('svg.item.property.fill')}' key='fill' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='fill-opacity'></span>
          </div>            
          <NumberRangeEditor 
            ref='$fillOpacity' 
            label='${this.$i18n('svg.item.property.fillOpacity')}' 
            key='fill-opacity' 
            value="1" 
            min="0"
            max="1"
            step="0.01"
            onchange="changeValue" 
            />
        </div>   


        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='fill-rule'></span>
          </div>
          <SelectIconEditor 
            ref='$fillRule' 
            label='${this.$i18n('svg.item.property.fillRule')}' 
            key="fill-rule" 
            options="nonzero,evenodd" 
            onchange="changeValue" />
        </div>            

        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='stroke'></span>
          </div>
          <FillSingleEditor ref='$stroke' label='${this.$i18n('svg.item.property.stroke')}' key='stroke' onchange="changeValue" />
        </div>      

        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='stroke-width'></span>
          </div>
          <RangeEditor 
            ref='$strokeWidth' 
            label='${this.$i18n('svg.item.property.strokeWidth')}' 
            key="stroke-width" 
            onchange="changeValue" />
        </div>
              

        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='stroke-dasharray'></span>      
          </div>          
          <label>${this.$i18n('svg.item.property.dashArray')}</label>
        </div>
        <div class='property-item'>
          <StrokeDashArrayEditor ref='$strokeDashArray' key='stroke-dasharray' onchange="changeValue" />
        </div>

        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='stroke-dashoffset'></span>      
          </div>          
          <NumberRangeEditor 
            ref='$strokeDashOffset' 
            key='stroke-dashoffset' 
            label='${this.$i18n('svg.item.property.dashOffset')}'
            value="0" 
            min="-1000"
            max="1000"
            step="1"
            onchange="changeValue" 
            />
        </div>         

        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='stroke-linecap'></span>      
          </div>          
          <SelectIconEditor 
            ref='$strokeLineCap' 
            label='${this.$i18n('svg.item.property.lineCap')}' 
            key="stroke-linecap" 
            options="butt,round,square" 
            onchange="changeValue" 
          />
        </div> 
        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='stroke-linejoin'></span>      
          </div>          
          <SelectIconEditor 
            ref='$strokeLineJoin' 
            label='${this.$i18n('svg.item.property.lineJoin')}'             
            key="stroke-linejoin" 
            options="miter,bevel,round" 
            onchange="changeValue" 
          />
        </div>       
        <div class='property-item animation-property-item'>
          <div class='group'>
            <span class='add-timeline-property' data-property='mix-blend-mode'></span>
          </div>
          <BlendSelectEditor 
            label='${this.$i18n('background.color.property.blend')}'
            ref='$mixBlend' 
            removable='true'
            key='mix-blend-mode' 
            icon="true" 
            tabIndex="1"
            onchange="changeSelect" />
        </div>                 
        <div class='property-item animation-property-item'>
          <div class='group'>        
            <span class='add-timeline-property' data-property='svgfilter'></span>      
          </div>
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

  [EVENT('changeValue')] (key, value, params) {
    this.command('setAttribute', `change svg item property : ${key}`, { 
      [key]: value
    })
  }

  [EVENT('changeSelect')] (key, value) {
    this.command("setAttribute", `change attribute : ${key}`, { 
      [key]: value
    })
  }
}
