import UIElement, { EVENT } from "../../../util/UIElement";
import propertyEditor from "../property-editor";
import { Length } from "../../../editor/unit/Length";


export default class DrawManager extends UIElement {

  initState() {
      return {
          tolerance: 1,
          fill: 'transparent',
          stroke: 'black',
          'fill-opacity': null,
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          msg: this.$i18n('path.manager.msg')
      }
  }

  components() {
    return {
      ...propertyEditor
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
    return /*html*/`
      <div class='draw-manager'>
        <div class='tools'>   
          <div >        
            <label>${this.$i18n('draw.manager.tolerance')}</label>            
            <NumberInputEditor 
              ref='$tolerance' 
              key='tolerance' 
              value="1" 
              min="0"
              max="100"
              step="0.01"
              unit="number" 
              onchange="changeValue" 
            />
          </div>              
          <div >
            <label>${this.$i18n('svg.item.property.fill')}</label>
            <FillSingleEditor ref='$fill' simple="true" value="${this.state.fill}" key='fill' onchange="changeValue" />
          </div>

          <div >
            <label>${this.$i18n('svg.item.property.fillOpacity')}</label>          
            <NumberInputEditor 
              ref='$fillOpacity' 
              key='fill-opacity' 
              value="${this.state['fill-opacity']}"
              min="0"
              max="1"
              step="0.01"
              calc="false"
              unit="number" 
              onchange="changeValue" 
              />
          </div>   
          <div >
            <label>${this.$i18n('svg.item.property.stroke')}</label>          
            <FillSingleEditor ref='$stroke' simple="true" value="${this.state.stroke}" key='stroke' onchange="changeValue" />
          </div>                

          <div >
            <label>${this.$i18n('svg.item.property.strokeWidth')}</label>          
            <NumberInputEditor 
              ref='$strokeWidth' 
              key="stroke-width" 
              value="${this.state['stroke-width']}"              
              onchange="changeValue" />
          </div>      
          

          <div>
            <label>${this.$i18n('svg.item.property.lineCap')}</label>          
            <SelectEditor
              ref='$strokeLineCap' 
              key="stroke-linecap" 
              value="${this.state['stroke-linecap']}"                   
              options="butt,round,square" 
              onchange="changeValue" 
            />
          </div> 
          <div>
            <label>${this.$i18n('svg.item.property.lineJoin')}</label>          
            <SelectEditor 
              ref='$strokeLineJoin' 
              key="stroke-linejoin" 
              value="${this.state['stroke-linejoin']}"                                 
              options="miter,bevel,round" 
              onchange="changeValue" 
            />
          </div>
        </div>
      </div>    
    `;
  }

  [EVENT('changeValue')] (key, value, params) {
    this.emit('setAttribute', { 
      [key]: value
    }, null, true)

    this.updateData({
      [key]: value
    })
  }  

  updateData(obj = {}) {

    this.setState(obj, false)
    this.emit(this.state.changeEvent, obj);
  }

  [EVENT('changePathManager')] (mode) {
    this.setState({ mode })
  }

  [EVENT('showDrawManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changeDrawManager';
      this.setState(obj)
      this.$el.show();

      this.emit('addStatusBarMessage', this.state.msg)
  }

  [EVENT('hideDrawManager')] () {
      this.$el.hide();
  }

  [EVENT('hideSubEditor')] () {
    this.trigger('hideDrawManager');
  }  

}
