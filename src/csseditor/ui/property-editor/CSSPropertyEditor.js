import UIElement, { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD, CLICK } from "../../../util/Event";
import icon from "../icon/icon";
import ColorViewEditor from "./ColorViewEditor";
import RangeEditor from "./RangeEditor";
import BackgroundImageEditor from "./BackgroundImageEditor";
import FilterEditor from "./FilterEditor";
import BoxShadowEditor from "./BoxShadowEditor";
import VarEditor from "./VarEditor";
import TransformEditor from "./TransformEditor";
import TransformOriginEditor from "./TransformOriginEditor";
import PerspectiveOriginEditor from "./PerspectiveOriginEditor";
import { OBJECT_TO_CLASS, OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import SelectEditor from "./SelectEditor";
import NumberRangeEditor from "./NumberRangeEditor";
import BorderRadiusEditor from "./BorderRadiusEditor";
import ClipPathEditor from "./ClipPathEditor";
import TextShadowEditor from "./TextShadowEditor";
import StrokeDashArrayEditor from "./StrokeDashArrayEditor";
import PathDataEditor from "./PathDataEditor";
import PolygonDataEditor from "./PolygonDataEditor";
import OffsetPathListEditor from "./OffsetPathListEditor";
import BorderEditor from "./BorderEditor";
import { editor } from "../../../editor/editor";


const blend_list = [
  '',
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
].join(',');


export default class CSSPropertyEditor extends UIElement {

  components() {
    return {
      BorderEditor,
      NumberRangeEditor,
      SelectEditor,
      TextShadowEditor,      
      BoxShadowEditor,
      FilterEditor,
      ColorViewEditor,
      RangeEditor,
      StrokeDashArrayEditor,
      BackgroundImageEditor,
      TransformEditor,
      TransformOriginEditor,
      PerspectiveOriginEditor,
      VarEditor,
      BorderRadiusEditor,
      ClipPathEditor,
      PathDataEditor,
      PolygonDataEditor,
      OffsetPathListEditor
    }
  }

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
          <label>Properties</label>
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
          return Length.string('');          
        case 'offset-distance': 
          return Length.percent(0);
        case 'mix-blend-mode': 
          return 'normal';
        case 'clip-path':
          return '';
        case 'opacity':
          return 1; 
        default: 
          return Length.px(0);
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

    var current = editor.selection.current;  

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
        <ColorViewEditor ref='$${key}${index}' value="${property.value}" key="${property.key}" onChange="changeColorProperty" />
      </div>
    `
  }

  makeCustomePropertyEditor (property, index) {
    return /*html*/`
      <div class='property-editor'>
        <${property.editor} ${OBJECT_TO_PROPERTY({
          onchange: 'changeSelect',
          ref: `$customProperty${index}`,
          key: property.key,
          value: property.value
        })} />
      </div>
    `
  }

  makeIndivisualPropertyEditor (property, index) {

    if (property.key === 'background-image') {
      return /*html*/`
        <div class='property-editor'>
          <BackgroundImageEditor ref='$backgroundImage${index}' key="${property.key}" hide-title="${this.state.hideTitle}" value="${property.value}" onChange="changeBackgroundImageProperty" />
        </div>
      `
    } else if (property.key === 'filter') {
      return /*html*/`
        <div class='property-editor'>
          <FilterEditor ref='$filter${index}' value="${property.value}" onChange="changeFilterProperty" />
        </div>
      `
    } else if (property.key === 'backdrop-filter') {
      return /*html*/`
        <div class='property-editor'>
          <FilterEditor ref='$backdropFilter${index}' value="${property.value}" onChange="changeBackdropFilterProperty" />
        </div>
      `      
    } else if (property.key === 'box-shadow') {
      return /*html*/`
        <div class='property-editor'>
          <BoxShadowEditor ref='$boxshadow${index}' value="${property.value}" hide-label="false" onChange="changeBoxShadowProperty" />
        </div>
      `      
    } else if (property.key === 'text-shadow') {
      return /*html*/`
        <div class='property-editor'>
          <TextShadowEditor ref='$textshadow${index}' value="${property.value}" hide-label="false" onChange="changeTextShadowProperty" />
        </div>
      `            
    } else if (property.key === 'var') {
      return `
        <div class='property-editor'>
          <VarEditor ref='$var${index}' value="${property.value}" onChange="changeVar" />
        </div>
      `       
    } else if (property.key === 'transform') {
      return `
        <div class='property-editor'>
          <TransformEditor ref='$transform${index}' value="${property.value}" onChange="changeTransform" />
        </div>
      `                  
    } else if (property.key === 'transform-origin') {
      return `
        <div class='property-editor'>
          <TransformOriginEditor ref='$transformOrigin${index}' value="${property.value}" onChange="changeTransformOrigin" />
        </div>
      `                  
    } else if (property.key === 'perspective-origin') {
      return `
        <div class='property-editor'>
          <PerspectiveOriginEditor ref='$perspectiveOrigin${index}' value="${property.value}" onChange="changePerspectiveOrigin" />
        </div>
      `               
    } else if (property.key === 'fill-rule') {
      return `
        <div class='property-editor'>
          <SelectEditor 
          ref='$fillRule${index}' 
          key='fill-rule' 
          icon="true" 
          options="nonzero,evenodd" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `       
    } else if (property.key === 'stroke-linecap') {
      return `
        <div class='property-editor'>
          <SelectEditor 
          ref='$strokeLinecap${index}' 
          key='stroke-linecap' 
          icon="true" 
          options="butt,round,square" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `       
      
    } else if (property.key === 'stroke-linejoin') {
      return `
        <div class='property-editor'>
          <SelectEditor 
          ref='$strokeLinejoin${index}' 
          key='stroke-linejoin' 
          icon="true" 
          options="miter,arcs,bevel,miter-clip,round" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `             
    } else if (property.key === 'mix-blend-mode') {
      return `
        <div class='property-editor'>
          <SelectEditor 
          ref='$mixBlendMode${index}' 
          key='mix-blend-mode' 
          icon="true" 
          options="${blend_list}" 
          value="${property.value}"
          onchange="changeSelect" />
        </div>
      `   
    } else if (property.key === 'stroke-dasharray') {
      return `
        <StrokeDashArrayEditor 
          ref='$strokeDashArray${index}' 
          key='stroke-dasharray'
          value='${property.value}' 
          onchange='changeSelect' 
        />
      `      
    } else if (property.key === 'border-radius') {
      return `
        <BorderRadiusEditor 
          ref='$borderRadius${index}' 
          key='border-radius'
          value='${property.value}' 
          onchange='changeBorderRadius' 
        />
      `
    } else if (property.key === 'border') {
      return `
        <BorderEditor 
          ref='$border${index}' 
          key='border'
          value='${property.value}' 
          onchange='changeKeyValue' 
        />
      `      
    } else if (property.key === 'clip-path') {
      return `
        <ClipPathEditor 
          ref='$clipPath${index}' 
          key='clip-path'
          value='${property.value}' 
          onchange='changeClipPath' 
        />
      `      
    } else if (property.key === 'd') {
      return /*html*/`
        <PathDataEditor ref='$pathData${index}' key='d' value='${property.value}' onchange='changeSelect' />
      `            
    } else if (property.key === 'points') {
      return /*html*/`
        <PolygonDataEditor ref='$polygonData${index}' key='points' value='${property.value}' onchange='changeSelect' />
      `    
    } else if (property.key === 'offset-path') {
      return /*html*/`
        <OffsetPathListEditor ref='$offsetPathList${index}' key='offset-path' value='${property.value}' onchange='changeSelect' />
      `             
    }

    return `
      <div class='property-editor'>
        ???

      </div>
    `

  }

  [EVENT('changeKeyValue')] (key, value) {
    this.modifyPropertyValue(key, value);
  }


  [EVENT('changeBorderRadius')] (value) {
    this.modifyPropertyValue('border-radius', value);
  }

  [EVENT('changeClipPath')] (value) {
    this.modifyPropertyValue('clip-path', value);
  }  

  [EVENT('changeColorProperty')] (key, color) {
    this.modifyPropertyValue(key, color);
  }  

  [EVENT('changeBackgroundImageProperty')] (key, backgroundImage) {
    this.modifyPropertyValue(key, backgroundImage);
  }  

  [EVENT('changeFilterProperty')] (filter) {
    this.modifyPropertyValue('filter', filter);
  }    

  [EVENT('changeBackdropFilterProperty')] (filter) {
    this.modifyPropertyValue('backdrop-filter', filter);
  }      

  [EVENT('changeBoxShadowProperty')] (boxshadow) {
    this.modifyPropertyValue('box-shadow', boxshadow);
  }   
  [EVENT('changeTextShadowProperty')] (textShadow) {
    this.modifyPropertyValue('text-shadow', textShadow);
  }     
  
  [EVENT('changeVar')] (value) {
    this.modifyPropertyValue('var', value);
  }     

  [EVENT('changeTransform')] (value) {
    this.modifyPropertyValue('transform', value);
  }       

  [EVENT('changeTransformOrigin')] (value) {
    this.modifyPropertyValue('transform-origin', value);
  }         

  [EVENT('changePerspectiveOrigin')] (value) {
    this.modifyPropertyValue('perspective-origin', value);
  }         

  [EVENT('changeSelect')] (key, value) {
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
        return /*html*/`
          <div class='property-editor'>
            <NumberRangeEditor 
              ref='$opacity${index}' 
              key='${property.key}' 
              min="0"
              max="1"
              step="0.01"
              value="${property.value || 1}"
              selected-unit='number'
              removable="true"
              onchange="changeRangeEditor" />
          </div>
        `
      // case 'rotate':
      //   return /*html*/`
      //     <div class='property-editor'>
      //       <RangeEditor 
      //         ref='rangeEditor${index}' 
      //         key='${property.key}' 
      //         value='${property.value}'  
      //         min="-2000"
      //         max="2000"
      //         units="deg" 
      //         onChange="changeRangeEditor" />
      //     </div>
      //   `
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
            <RangeEditor ref='rangeEditor${index}' key='${property.key}' value='${property.value}' max="1000" onChange="changeRangeEditor" />
          </div>
        `
    }

  }

  [EVENT('changeRangeEditor')] (key, value) {
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
        <optgroup label='--'>
          <option value='var'>var</option>
        </optgroup>            
        <optgroup label='Motion'>
          <option value='offset-distance'>offset-distance</option>
        </optgroup>      
        <optgroup label='Size'>
          <option value='x'>x</option>
          <option value='y'>y</option>        
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

  [EVENT("showCSSPropertyEditor")](properties = []) {
    this.setState({ properties });
    this.refresh();
  }

  [CLICK('$property .remove')] (e) {
    var index = +e.$delegateTarget.attr('data-index')

    this.state.properties.splice(index, 1);
    this.refresh();
    this.modifyProperty();
  }

  [CLICK('$property .refresh')] (e) {
    this.parent.trigger('refreshPropertyValue');
  }  
}
