import { Length } from "el/editor/unit/Length";
import { LOAD, CLICK, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { OBJECT_TO_CLASS } from "el/base/functions/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";


export default class CSSPropertyEditor extends EditorElement {

  initState() {
    return {
      hideTitle: this.props['hide-title'] === 'true',
      hideRefresh: this.props['hide-refresh'] === 'true',
      properties: [] 
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.modifyProperty();
  }

  modifyProperty () {

    this.parent.trigger(this.props.onchange, this.state.properties);
  }


  template() {
    return /*html*/`
      <div class='css-property-editor ${OBJECT_TO_CLASS({ 
        'hide-title': this.state.hideTitle, 
        'hide-refresh': this.state.hideRefresh 
      })}'>
        <div class='title'>
          <label>${this.$i18n('css.property.editor.properties')}</label>
          <div class='tools'>
            ${this.makePropertySelect()}
            <button type="button" ref='$addProperty'>${icon.add}</button>
          </div>
        </div>
        <div class='input grid-1 css-property-list' ref='$property'></div>
      </div>
    `
  }  

  getPropertyDefaultValue (key) {

      switch(key) {
        case 'animation-timing-function':
        case 'box-shadow':
        case 'text-shadow':
        case 'color':
        case 'background-image':
        case 'background-color':
        case 'text-fill-color':
        case 'text-stroke-color':
        case 'filter':      
        case 'backdrop-filter':      
        case 'var':
        case 'transform':          
        case 'transform-origin':
        case 'perspective-origin':
        case 'playTime':
          return Length.string('');          
        case 'offset-distance': 
          return Length.percent(0);
        case 'rotate':
          return Length.deg(0);
        case 'mix-blend-mode': 
          return 'normal';
        case 'clip-path':
          return '';
        case 'opacity':
          return 1; 
        default: 
          return Length.z();
      }
  }

  [CLICK('$addProperty')] (e) {
    var key = this.getRef('$propertySelect').value;


    var searchItem = this.state.properties.find((it) => {
      return it.key === key 
    })

    if (searchItem) {
      alert(`${key} is already added.`)
      return; 
    }

    var value = this.getPropertyDefaultValue(key)

    var current = this.$selection.current;  

    if (current) {
      value = current[key]
    }

    this.state.properties.push({ key, value })

    this.refresh();
    this.modifyProperty();

  }


  makeIndivisualPropertyColorEditor (property, index) {

    var key = property.key.split('-').join('');
    return /*html*/`
      <div class='property-editor'>
        <object refClass="ColorViewEditor" ref='$${key}${index}' value="${property.value}" key="${property.key}" onChange="changeColorProperty" />
      </div>
    `
  }

  makeCustomePropertyEditor (property, index) {
    return /*html*/`
      <div class='property-editor'>
        <${property.editor} 
          onchange="changeSelect"
          ref="$customProperty${index}"
          key="${property.key}"
          value="${property.value}"
        />
      </div>
    `
  }

  makeIndivisualPropertyEditor (property, index) {

    if (property.key === 'background-image') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="BackgroundImageEditor" ref='$backgroundImage${index}' key="${property.key}" hide-title="${this.state.hideTitle}" value="${property.value}" onChange="changeKeyValue" />
        </div>
      `
    } else if (property.key === 'filter') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="FilterEditor" ref='$filter${index}' key="${property.key}" value="${property.value}" onChange="changeKeyValue" />
        </div>
      `
    } else if (property.key === 'backdrop-filter') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="FilterEditor" ref='$backdropFilter${index}' key="${property.key}" value="${property.value}" onChange="changeKeyValue" />
        </div>
      `      
    } else if (property.key === 'box-shadow') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="BoxShadowEditor" ref='$boxshadow${index}' value="${property.value}" hide-label="false" onChange="changeBoxShadowProperty" />
        </div>
      `      
    } else if (property.key === 'text-shadow') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="TextShadowEditor" ref='$textshadow${index}' value="${property.value}" hide-label="false" onChange="changeTextShadowProperty" />
        </div>
      `            
    } else if (property.key === 'var') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="VarEditor" ref='$var${index}' value="${property.value}" onChange="changeVar" />
        </div>
      `       
    } else if (property.key === 'transform') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="TransformEditor" ref='$transform${index}' value="${property.value}" onChange="changeTransform" />
        </div>
      `                  
    } else if (property.key === 'transform-origin') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="TransformOriginEditor" ref='$transformOrigin${index}' value="${property.value}" onChange="changeTransformOrigin" />
        </div>
      `                  
    } else if (property.key === 'perspective-origin') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="PerspectiveOriginEditor" ref='$perspectiveOrigin${index}' value="${property.value}" onChange="changePerspectiveOrigin" />
        </div>
      `               
    } else if (property.key === 'fill-rule') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="SelectEditor"  
          ref='$fillRule${index}' 
          key='fill-rule' 
          icon="true" 
          options="nonzero,evenodd" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `       
    } else if (property.key === 'stroke-linecap') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="SelectEditor"  
          ref='$strokeLinecap${index}' 
          key='stroke-linecap' 
          icon="true" 
          options="butt,round,square" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `       
      
    } else if (property.key === 'stroke-linejoin') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="SelectEditor"  
          ref='$strokeLinejoin${index}' 
          key='stroke-linejoin' 
          icon="true" 
          options="miter,arcs,bevel,miter-clip,round" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `             
    } else if (property.key === 'mix-blend-mode') {
      return /*html*/`
        <div class='property-editor'>
          <object refClass="BlendSelectEditor" 
          ref='$mixBlendMode${index}' 
          key='mix-blend-mode' 
          icon="true" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `   
    } else if (property.key === 'stroke-dasharray') {
      return /*html*/`
        <object refClass="StrokeDashArrayEditor" 
          ref='$strokeDashArray${index}' 
          key='stroke-dasharray'
          value='${property.value}' 
          onchange='changeSelect' 
        />
      `      
    } else if (property.key === 'border-radius') {
      return /*html*/`
        <object refClass="BorderRadiusEditor"
          ref='$borderRadius${index}' 
          key='border-radius'
          value='${property.value}' 
          onchange='changeBorderRadius' 
        />
      `
    } else if (property.key === 'border') {
      return /*html*/`
        <object refClass="BorderEditor"
          ref='$border${index}' 
          key='border'
          value='${property.value}' 
          onchange='changeKeyValue' 
        />
      `      
    } else if (property.key === 'clip-path') {
      return /*html*/`
        <object refClass="ClipPathEditor"
          ref='$clipPath${index}' 
          key='clip-path'
          value='${property.value}' 
          onchange='changeClipPath' 
        />
      `      
    } else if (property.key === 'd') {
      return /*html*/`
        <object refClass="PathDataEditor" ref='$pathData${index}' key='d' value='${property.value}' onchange='changeSelect' />
      `            
    } else if (property.key === 'points') {
      return /*html*/`
        <object refClass="PolygonDataEditor" ref='$polygonData${index}' key='points' value='${property.value}' onchange='changeSelect' />
      `    
    } else if (property.key === 'playTime') {
      return /*html*/`
        <object refClass="MediaProgressEditor" ref='$playTime${index}'  key='playTime' value="${property.value}" onchange="changeSelect" />      
      `                   
    }

    return /*html*/`
      <div class='property-editor'>
        ???

      </div>
    `

  }

  [SUBSCRIBE_SELF('changeKeyValue')] (key, value) {
    this.modifyPropertyValue(key, value);
  }


  [SUBSCRIBE_SELF('changeBorderRadius')] (value) {
    this.modifyPropertyValue('border-radius', value);
  }

  [SUBSCRIBE_SELF('changeClipPath')] (value) {
    this.modifyPropertyValue('clip-path', value);
  }  

  [SUBSCRIBE_SELF('changeColorProperty')] (key, color) {
    this.modifyPropertyValue(key, color);
  }  

  [SUBSCRIBE_SELF('changeBackgroundImageProperty')] (key, backgroundImage) {
    this.modifyPropertyValue(key, backgroundImage);
  }  

  [SUBSCRIBE_SELF('changeFilterProperty')] (filter) {
    this.modifyPropertyValue('filter', filter);
  }    

  [SUBSCRIBE_SELF('changeBackdropFilterProperty')] (filter) {
    this.modifyPropertyValue('backdrop-filter', filter);
  }      

  [SUBSCRIBE_SELF('changeBoxShadowProperty')] (boxshadow) {
    this.modifyPropertyValue('box-shadow', boxshadow);
  }   
  [SUBSCRIBE_SELF('changeTextShadowProperty')] (textShadow) {
    this.modifyPropertyValue('text-shadow', textShadow);
  }     
  
  [SUBSCRIBE_SELF('changeVar')] (value) {
    this.modifyPropertyValue('var', value);
  }     

  [SUBSCRIBE_SELF('changeTransform')] (value) {
    this.modifyPropertyValue('transform', value);
  }       

  [SUBSCRIBE_SELF('changeTransformOrigin')] (value) {
    this.modifyPropertyValue('transform-origin', value);
  }         

  [SUBSCRIBE_SELF('changePerspectiveOrigin')] (value) {
    this.modifyPropertyValue('perspective-origin', value);
  }         

  [SUBSCRIBE_SELF('changeSelect')] (key, value) {
    this.modifyPropertyValue(key, value);
  }


  makePropertyEditor (property, index) {

    if (property.editor) {
      return this.makeCustomePropertyEditor(property, index);
    }

    switch(property.key) {

      case 'animation-timing-function':
      case 'box-shadow':
      case 'text-shadow':
      case 'background-image':
      case 'filter':
      case 'backdrop-filter':
      case 'var':
      case 'transform':
      case 'transform-origin':
      case 'perspective-origin':
      case 'mix-blend-mode':  
      case 'border':
      case 'border-radius':   
      case 'clip-path':   
      case 'fill-rule':
      case 'stroke-linecap':
      case 'stroke-linejoin':
      case 'stroke-dasharray':
      case 'd':
      case 'points':
      case 'offset-path':
      case 'playTime':
        return this.makeIndivisualPropertyEditor(property, index);
      case 'color':
      case 'background-color':
      case 'text-fill-color':
      case 'text-stroke-color':
      case 'stroke':
      case 'fill':
        return this.makeIndivisualPropertyColorEditor(property, index);
      case 'opacity':
      case 'fill-opacity':        
      case 'stroke-dashoffset':
      case 'offset-distance':

        let min = 0;
        let max = 1; 
        let step = 0.01; 

        return /*html*/`
          <div class='property-editor'>
            <object refClass="NumberRangeEditor"  
              ref='$opacity${index}' 
              key='${property.key}' 
              min="${min}"
              max="${max}"
              step="${step}"
              value="${property.value || 1}"
              selected-unit='number'
              removable="true"
              onchange="changeRangeEditor" />
          </div>
        `
      case 'rotate':
        return /*html*/`
          <div class='property-editor'>
            <object refClass="RangeEditor"  
              ref='rangeEditor${index}' 
              key='${property.key}' 
              value='${property.value}'  
              min="-2000"
              max="2000"
              units="deg" 
              onChange="changeRangeEditor" />
          </div>
        `
      case 'left': 
      case 'margin-top': 
      case 'margin-bottom': 
      case 'margin-left': 
      case 'margin-right': 
      case 'padding-top': 
      case 'padding-bottom': 
      case 'padding-left': 
      case 'padding-right': 

      case 'font-size': 
      case 'font-stretch': 
      case 'width': 
      case 'height':   
      case 'perspective':  
      case 'offset-distance':
      case 'text-stroke-width':
      default: 
        return /*html*/`
          <div class='property-editor'>
            <object refClass="RangeEditor"  ref='rangeEditor${index}' key='${property.key}' value='${property.value}' max="1000" onChange="changeRangeEditor" />
          </div>
        `
    }

  }

  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value) {
    this.modifyPropertyValue(key, value + "");
  }

  searchKey (key, callback) {
    this.state.properties.filter(it => it.key === key).forEach(callback)
  }

  modifyPropertyValue (key, value) {

    this.searchKey(key, (it) => {
      it.value = value; 
    })
    this.modifyProperty()    

  }


  makePropertySelect() {
    return /*html*/`
      <select class='property-select' ref='$propertySelect'>
        <optgroup label='Position'>
          <option value='x'>x</option>
          <option value='y'>y</option>        
        </optgroup>
        <optgroup label='Size'>
          <option value='width'>width</option>
          <option value='height'>height</option>
        </optgroup>      
        <optgroup label='Box Model'>
          <option value='margin-left'>margin-left</option>
          <option value='margin-right'>margin-right</option>
          <option value='margin-bottom'>margin-bottom</option>
          <option value='margin-top'>margin-top</option>
          <option value='padding-left'>padding-left</option>
          <option value='padding-right'>padding-right</option>
          <option value='padding-bottom'>padding-bottom</option>
          <option value='padding-top'>padding-top</option>       
        </optgroup>
        <optgroup label='Border'>
          <option value='border'>border</option>
          <option value='border-radius'>border-radius</option>
        </optgroup>        
        <optgroup label='Style'>
          <option value='background-color'>background-color</option>
          <option value='background-image'>background-image</option>
          <option value='box-shadow'>box-shadow</option>
          <option value='text-shadow'>text-shadow</option>
          <option value='filter'>filter</option>      
          <option value='backdrop-filter'>backdrop-filter</option>
          <option value='mix-blend-mode'>mix-blend-mode</option>
        </optgroup>            
        <optgroup label='Transform'>
          <option value='transform'>transform</option>
          <option value='transform-origin'>transform-origin</option>
          <option value='perspective'>perspective</option>
          <option value='perspective-origin'>perspective-origin</option>
        </optgroup>
        <optgroup label='Font'>
          <option value='font-size'>font-size</option>
          <option value='font-weight'>font-weight</option>          
          <option value='font-stretch'>font-stretch</option>
        </optgroup>
        <optgroup label='Animation'>
          <option value='animation-timing-function'>timing-function</option>
        </optgroup>        
      </select>
    `
  }

  [LOAD('$property')] () {
    return this.state.properties.map( (it, index) => {
      return /*html*/`
        <div class='css-property-item'>
          <div class='title'>
            <label>${it.key}</label>
            <div class='tools'>
              <button type="button" class='remove' data-index="${index}">${icon.remove2}</button>
            </div>
          </div>
          <div class='title-2'>
            <div class='tools'>
              <label><button type="button" class='refresh' data-index="${index}">${icon.refresh}</button> Refresh</label>
            </div>
          </div>
          <div class='value-editor'>
            ${this.makePropertyEditor(it, index)}
          </div>
        </div>
      `
    })
  }

  [SUBSCRIBE("showCSSPropertyEditor")](properties = []) {
    this.setState({ properties });
    this.refresh();
  }

  [CLICK('$property .remove')] (e) {
    var index = +e.$dt.attr('data-index')

    this.state.properties.splice(index, 1);
    this.refresh();
    this.modifyProperty();
  }

  [CLICK('$property .refresh')] (e) {
    this.parent.trigger('refreshPropertyValue');
  }  
}