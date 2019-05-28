import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { LOAD, CLICK, INPUT } from "../../../../util/Event";
import { html } from "../../../../util/functions/func";
import icon from "../../icon/icon";
import ColorViewEditor from "./property-editor/ColorViewEditor";
import RangeEditor from "./property-editor/RangeEditor";
import BackgroundImageEditor from "./property-editor/BackgroundImageEditor";


export default class OffsetPropertyEditor extends UIElement {

  components() {
    return {
      ColorViewEditor,
      RangeEditor,
      BackgroundImageEditor
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
    this.emit("changeOffsetPropertyEditor", this.state.properties);  
  }


  template() {
    return html`
      <div class='offset-property-editor'>
        <div class='title' >
          <label>Properties</label>
          <div class='tools'>
            ${this.makePropertySelect()}
            <button type="button" ref='$addProperty'>${icon.add}</button>
          </div>
        </div>
        <div class='input grid-1 keyframe-property-list' ref='$property'></div>
      </div>
    `
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
      key, value: Length.string('')
    })

    this.refresh();
    this.modifyProperty();

  }

  makeIndivisualPropertyEditor (property) {

    if (property.key === 'background-color') {
      return `
        <div class='property-editor'>
          <ColorViewEditor ref='$backgroundColor' color="${property.value}" onChange="changeBackgroundColorProperty" />
        </div>
      `
    } else if (property.key === 'background-image') {
      return `
        <div class='property-editor'>
          <BackgroundImageEditor ref='$backgroundImage' value="${property.value}" onChange="changeBackgroundImageProperty" />
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


  makePropertyEditor (property) {
    var min = null;
    var max = null; 

    switch(property.key) {

      case 'animation-timing-function':
      case 'box-shadow':
      case 'text-shadow':
      case 'background-image':
      case 'background-color':
        return this.makeIndivisualPropertyEditor(property);
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
      default: 
        return `
          <div class='property-editor'>
            <RangeEditor key='${property.key}' value='${property.value}' onChange="changeRangeEditor" />
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
        <div class='keyframe-property-item'>
          <div class='title'>
            <label>${it.key}</label>
            <div class='tools'>
              <button type="button">${icon.remove2}</button>
            </div>
          </div>
          <div class='value-editor'>
            ${this.makePropertyEditor(it)}
          </div>
        </div>
      `
    })
  }

  // 개별 속성을 변경할 때  state 로 저장 하기 

  refresh() {
    this.load();
  }

  [EVENT("showOffsetPropertyEditor")](properties = []) {
    this.setState({ properties });
    this.refresh();

  }
}
