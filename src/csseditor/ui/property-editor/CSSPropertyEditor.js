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



export default class CSSPropertyEditor extends UIElement {

  components() {
    return {
      BoxShadowEditor,
      FilterEditor,
      ColorViewEditor,
      RangeEditor,
      BackgroundImageEditor,
      TransformEditor,
      TransformOriginEditor,
      PerspectiveOriginEditor,
      VarEditor
    }
  }

  initState() {
    return {
      properties: [] 
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.modifyProperty();
  }

  modifyProperty () {

    this.parent.trigger(this.props.onchange, this.state.properties);
    // this.emit("changeCSSPropertyEditor", this.state.properties);  
  }


  template() {
    return `
      <div class='css-property-editor'>
        <div class='title' >
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
        case 'background-image':
        case 'background-color':
        case 'filter':      
        case 'backdrop-filter':      
        case 'var':
        case 'transform':          
        case 'transform-origin':
        case 'perspective-origin':
          return Length.string('');          
        case 'offset-distance': 
          return Length.percent(0);
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

    this.state.properties.push({
      key, value: this.getPropertyDefaultValue(key)
    })

    this.refresh();
    this.modifyProperty();

  }

  makeIndivisualPropertyEditor (property, index) {

    if (property.key === 'background-color') {
      // colorview 를 열면 다른 팝업도 같이 닫혀 버린다. 
      // 여기서는 다른 열린 팝업이 변경되지 않아야 하긴 한데... 
      // 속성이 한두개도 아니고 이거 어떻게 처리하지? 
      // 컬러만 그런게 아니라 팝업 뜨는 애들 다그렇다. 
      return `
        <div class='property-editor'>
          <ColorViewEditor ref='$backgroundColor${index}' color="${property.value}" onChange="changeBackgroundColorProperty" />
        </div>
      `
    } else if (property.key === 'background-image') {
      return `
        <div class='property-editor'>
          <BackgroundImageEditor ref='$backgroundImage${index}' value="${property.value}" onChange="changeBackgroundImageProperty" />
        </div>
      `
    } else if (property.key === 'filter') {
      return `
        <div class='property-editor'>
          <FilterEditor ref='$filter${index}' value="${property.value}" onChange="changeFilterProperty" />
        </div>
      `
    } else if (property.key === 'backdrop-filter') {
      return `
        <div class='property-editor'>
          <FilterEditor ref='$backdropFilter${index}' value="${property.value}" onChange="changeBackdropFilterProperty" />
        </div>
      `      
    } else if (property.key === 'box-shadow') {
      return `
        <div class='property-editor'>
          <BoxShadowEditor ref='$boxshadow${index}' value="${property.value}" onChange="changeBoxShadowProperty" />
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
    }

    return `
      <div class='property-editor'>
        ???

      </div>
    `

  }

  [EVENT('changeBackgroundColorProperty')] (color) {
    this.modifyPropertyValue('background-color', color);
  }

  [EVENT('changeBackgroundImageProperty')] (backgroundImage) {
    this.modifyPropertyValue('background-image', backgroundImage);
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


  makePropertyEditor (property, index) {
    var min = null;
    var max = null; 

    switch(property.key) {

      case 'animation-timing-function':
      case 'box-shadow':
      case 'text-shadow':
      case 'background-image':
      case 'background-color':
      case 'filter':
      case 'backdrop-filter':
      case 'var':
      case 'transform':
      case 'transform-origin':
      case 'perspective-origin':
        return this.makeIndivisualPropertyEditor(property, index);
      case 'left': 
      case 'margin-top': 
      case 'margin-bottom': 
      case 'margin-left': 
      case 'margin-right': 
      case 'padding-top': 
      case 'padding-bottom': 
      case 'padding-left': 
      case 'padding-right': 

      case 'border-radius': 
      case 'font-size': 
      case 'width': 
      case 'height':   
      case 'perspective':  
      case 'offset-distance':
      default: 
        return `
          <div class='property-editor'>
            <RangeEditor ref='rangeEditor${index}' key='${property.key}' value='${property.value}' onChange="changeRangeEditor" />
          </div>
        `
    }

  }

  [EVENT('changeRangeEditor')] (key, value) {
    this.modifyPropertyValue(key, value);
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
    return `
      <select class='property-select' ref='$propertySelect'>
        <optgroup label='--'>
          <option value='var'>var</option>
        </optgroup>            
        <optgroup label='Motion'>
          <option value='offset-distance'>offset-distance</option>
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
          <option value='border-top'>border-top</option>
          <option value='border-bottom'>border-bottom</option>
          <option value='border-left'>border-left</option>
          <option value='border-right'>border-right</option>
        </optgroup>
        <optgroup label='Border Radius'>
          <option value='border-radius'>border-radius</option>
        </optgroup>        
        <optgroup label='Style'>
          <option value='background-color'>background-color</option>
          <option value='background-image'>background-image</option>
          <option value='box-shadow'>box-shadow</option>
          <option value='text-shadow'>text-shadow</option>
          <option value='filter'>filter</option>      
          <option value='backdrop-filter'>backdrop-filter</option>          
        </optgroup>            
        <optgroup label='Transform'>
          <option value='transform'>transform</option>
          <option value='transform-origin'>transform-origin</option>
          <option value='perspective'>perspective</option>
          <option value='perspective-origin'>perspective-origin</option>
        </optgroup>
        <optgroup label='Font'>
          <option value='font-size'>font-size</option>
        </optgroup>
        <optgroup label='Animation'>
          <option value='animation-timing-function'>timing-function</option>
        </optgroup>        
      </select>
    `
  }

  [LOAD('$property')] () {
    return this.state.properties.map( (it, index) => {
      return `
        <div class='css-property-item'>
          <div class='title'>
            <label>${it.key}</label>
            <div class='tools'>
              <button type="button" class='remove' data-index="${index}">${icon.remove2}</button>
            </div>
          </div>
          <div class='value-editor'>
            ${this.makePropertyEditor(it, index)}
          </div>
        </div>
      `
    })
  }

  // 개별 속성을 변경할 때  state 로 저장 하기 

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
}
