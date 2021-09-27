import icon, { iconUse } from "el/editor/icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  DOMDIFF
} from "el/sapa/Event";

import { Transform } from "el/editor/property-parser/Transform";
import { Length } from "el/editor/unit/Length";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './TransformEditor.scss';
import { isNotUndefined } from "el/sapa/functions/func";

var transformList = [
  'perspective',  
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'rotate3d',    
  'skew',
  'skewX',    
  'skewY',   
  'translate',
  'translateX',  
  'translateY',
  'translateZ',
  'translate3d',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'scale3d',
  'matrix',
  'matrix3d',  
];

const labels = {
  'scale': [ 'X', 'Y'] ,
  'skew': [ 'X', 'Y'] ,  
  'translate' : ['X', 'Y'], 
  'translate3d': ['tx','ty', 'tz'],
  'matrix': ['a','b','c','d','tx','ty'],
  'matrix3d': [
    'a1', 'b1', 'c1', 'd1', 
    'a2', 'b2', 'c2', 'd2', 
    'a3', 'b3', 'c3', 'd3', 
    'a4', 'b4', 'c4', 'd4'
  ]
}

export default class TransformEditor extends EditorElement {

  initState() {
    return {
      hideLabel: this.props['hide-label'] === 'true' ? true: false, 
      transforms: Transform.parseStyle(this.props.value)
    }
  }

  template() {
    var labelClass = this.state.hideLabel ? 'hide' : '' 
    return /*html*/`
      <div class='elf--transform-editor transform-list'>
          <div class='label ${labelClass}' >
              <label>Transform</label>
              <div class='tools'>
                <select ref="$transformSelect">
                  ${transformList.map(transform => {
                    var label = this.$i18n('css.item.' + transform)
                    return `<option value='${transform}'>${label}</option>`;
                  }).join('')}
                </select>
                <button type="button" ref="$add" title="add Transform">${icon.add}</button>
              </div>
          </div>
          <div class='transform-list' ref='$transformList'></div>
      </div>`;
  }

  getLabel(type, index) {
    switch(type) {
      case 'scale':
      case 'translate':
      case 'translate3d':        
      case 'matrix':
      case 'matrix3d': 
      case 'skew':
        return labels[type][index];
      }
    return ''
  }

  isMultiValue (type) {
    switch(type) {
      case 'translate3d':        
      case 'matrix':
      case 'matrix3d': 
      case 'skew':
        return true;
      }
    return false; 
  }

  getRange(type) {

    switch(type) {
      case 'translateX': 
      case 'translateY': 
      case 'translateZ': 
      case 'translate':      
      case 'translate3d':            
        return { min: -100, max : 100, step: 1, units: 'px,%,em'}
      case 'matrix':
      case 'matrix3d':     
        return { min: -100, max : 100, step: 0.01,units: 'number'}
      case 'rotateX': 
      case 'rotateY': 
      case 'rotateZ': 
      case 'rotate':  
      case 'skew':      
      case 'skewY':
      case 'skewX':            
        return { min: -360, max : 360, step: 0.1, units: 'deg,turn,rad', editorType: 'RangeEditor'}
      case 'perspective':
          return { min: 0, max : 10000, step: 1, units: 'px,%,em'}
      case 'scale': 
      case 'scaleX': 
      case 'scaleY': 
        return { min: 0, max : 10, step: 0.1,units: 'number'}           
    }


    return { min: 0, max : 100, step : 1,units: 'px,%,em' }
  }

  makeOneTransformTemplate(type, transform, index) {
    return /*html*/`
      <div class="transform-item" data-index="${index}">
        <div class="title" data-index="${index}">
          <label draggable="true" >${this.$i18n('css.item.' + type)}</label>
          <div class="transform-menu">
            <button type="button" class="del" data-index="${index}">
              ${iconUse("remove2")}
            </button>
          </div>
        </div>
        <div class="transform-ui ${type}">
        ${transform.value.map( (it, tindex) => {

          var label = this.getLabel(type, tindex);
          var {min, max, step, units} = this.getRange(type);

          return /*html*/`
            <div>
              <object refClass="RangeEditor"  
                    ref='$range_${type}_${index}_${tindex}' 
                    min="${min}" 
                    max="${max}" 
                    step="${step}" 
                    label="${label}"
                    key="${index}" 
                    params='${tindex}' 
                    value="${it}" 
                    units="${units}" 
                    onchange="changeRangeEditor" />
            </div>`
          }).join('')}      
      </div>        

      </div>
    `;
  }



  makeMultiTransformTemplate(type, transform, index) {
    return /*html*/`
      <div class="transform-item" data-index="${index}">
        <div class="title" data-index="${index}">
          <label draggable="true" >${this.$i18n('css.item.' + type)}</label>
          <div></div>
          <div class="transform-menu">
            <button type="button" class="del" data-index="${index}">
              ${iconUse("remove2")}
            </button>
          </div>
        </div>
        <div class="transform-ui ${type}">

          ${type === 'translate3d' ? `
            <pre>
  1 | 0 | 0 | tx
  0 | 1 | 0 | ty	
  0 | 0 | 1 | tz	
  0 | 0 | 0 | 1</pre>
          `: ''}

          ${type === 'matrix' ? `
            <pre>
  a | c | tx	
  b | d | ty	
  0 | 0 | 1</pre>
          `: ''}    
          
          ${type === 'matrix3d' ? `
            <pre>
  a1 | a2 | a3 | a4	
  b1 | b2 | b3 | b4	
  c1 | c2 | c3 | c4	
  d1 | d2 | d3 | d4</pre>
          `: ''}     
          
          <div class='${type}'>
          ${transform.value.map( (it, tindex) => {

            var label = this.getLabel(type, tindex);
            var {min, max, step, units, editorType = 'NumberInputEditor'} = this.getRange(type);

            return /*html*/`
              <div>
                <object refClass="${editorType}"  
                      ref='$range_${type}_${index}_${tindex}' 
                      min="${min}" 
                      max="${max}" 
                      step="${step}" 
                      label="${label}"
                      key="${index}" 
                      params='${tindex}' 
                      value="${it}" 
                      units="${units}" 
                      onchange="changeRangeEditor" />
              </div>`
          }).join('')}   
          </div>       
        </div>
      </div>
    `;
  }

  makeTransformTemplate(transform, index) {
    if (this.isMultiValue(transform.type)) {

      return this.makeMultiTransformTemplate(
        transform.type,
        transform,
        index
      );
    } else {

      return this.makeOneTransformTemplate(
        transform.type,
        transform,
        index
      );
    }

  }

  [LOAD("$transformList") + DOMDIFF]() {
    return this.state.transforms.map((transform, index) => {
      return this.makeTransformTemplate(transform, index.toString());
    });
  }

  setValue(transform) {
    this.setState({
      transforms: Transform.parseStyle(transform)
    });
  }

  [DRAGSTART("$transformList .transform-item .title label")](e) {
    this.startIndex = +e.$dt.parent().attr("data-index");
  }

  [DRAGOVER("$transformList .transform-item") + PREVENT](e) {}

  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortTransform(startIndex, targetIndex) {
      this.sortItem(this.state.transforms, startIndex, targetIndex);
  }

  [DROP("$transformList .transform-item") + PREVENT](e) {
    var targetIndex = +e.$dt.attr("data-index");
    var current = this.$selection.current;
    if (!current) return;

    this.sortTransform(this.startIndex, targetIndex);

    this.refresh();

    this.modifyTransform()
  }

  modifyTransform () {
    var value = this.state.transforms.join(' ');

    this.parent.trigger(this.props.onchange, value)
  }

  getDefaultValue (type) {

    switch(type) {
      case 'translateX': 
      case 'translateY': 
      case 'translateZ': 
        return [Length.z()]            
      case 'rotateX': 
      case 'rotateY': 
      case 'rotateZ': 
      case 'rotate':  
      case 'skewY':
      case 'skewX':
      case 'perspective':
        return [Length.deg(0)]            
      case 'translate': 
        return [Length.z(),Length.z()]
      case 'translate3d': 
        return [Length.z(),Length.z(), Length.z()]        
      case 'scale': 
        return [Length.number(1),Length.number(1)]
      case 'skew': 
        return [Length.deg(0),Length.deg(0)]
      case 'scaleX': 
      case 'scaleY': 
        return [Length.number(1)]
      case 'matrix':
        return [
          Length.number(1),
          Length.number(0),
          Length.number(0),
          Length.number(1),
          Length.number(0),
          Length.number(0)          
        ]
      case 'matrix3d':
        return [
          Length.number(1),
          Length.number(0),
          Length.number(0),
          Length.number(0),

          Length.number(0),
          Length.number(1),
          Length.number(0),
          Length.number(0),

          Length.number(0),
          Length.number(0),
          Length.number(1),
          Length.number(0),
          
          Length.number(0),
          Length.number(0),
          Length.number(0), 
          Length.number(1)                   
        ]        
    }


    return [Length.number(0)]
  }

  makeTransform(type, opt = {}) {

    var value = this.getDefaultValue(type)

    return Transform.parse({ ...opt, type, value });
  }

  [SUBSCRIBE_SELF('add')] (transformType) { 
    this.state.transforms.push(this.makeTransform(transformType))

    this.refresh();

    this.modifyTransform()
  }

  [CLICK("$add")]() {
    var transformType = this.refs.$transformSelect.value;

    this.trigger('add', transformType)
  }

  [CLICK("$transformList .transform-menu .del")](e) {
    var index = +e.$dt.attr("data-index");
    this.state.transforms.splice(index, 1);

    this.refresh();

    this.modifyTransform()
  }

  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value, params) {
    if (isNotUndefined(params)) {
      this.state.transforms[+key].value[+params] = value; 
    } else {
      this.state.transforms[+key].reset({ 
        value 
      });
    }
    

    this.modifyTransform();
  }
}