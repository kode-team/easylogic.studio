import UIElement, { EVENT } from "../../../../../util/UIElement";
import { LOAD, CLICK, POINTERSTART, MOVE, END, BIND } from "../../../../../util/Event";
import { Length } from "../../../../../editor/unit/Length";
import Color from "../../../../../util/Color";
import RangeEditor from "./RangeEditor";
import { convertMatches, reverseMatches } from "../../../../../util/functions/parser";

import SelectEditor from "./SelectEditor";

var radialTypeList = [
  'circle',
  'circle closest-side',
  'circle closest-corner',
  'circle farthest-side',
  'circle farthest-corner',
  'ellipse',
  'ellipse closest-side',
  'ellipse closest-corner',
  'ellipse farthest-side',
  'ellipse farthest-corner'
]

export default class GradientEditor extends UIElement  {

  components() {
    return {
      RangeEditor,
      SelectEditor
    }
  }

  initState() {
    var colorsteps = [
      { offset: Length.percent(0), cut: false, color: 'yellow' },
      { offset: Length.percent(100), cut: false, color: 'red' }
    ] 

    return {
      type: 'static-gradient',
      index: 0,
      colorsteps,
      radialPosition: [ 'center', 'center'],
      radialType: 'ellipse'
    }
  }

  setValue (str, index = 0, type = 'static-gradient') {
    var results = convertMatches(str);
    var colorsteps = results.str.split(',').map(it => it.trim()).map(it => {
      var [color, offset1, offset2 ] = it.split(' ').filter(str => str.length);

       color = reverseMatches(color, results.matches);
      var cut = false; 
      if (offset2) {
        cut = true; 
      }

      var offset = cut ? Length.parse(offset2) : Length.parse(offset1)

      if (offset.isDeg()) {
        offset = Length.percent(offset.value/360 * 100)
      }

      return { color, offset, cut }

    })

    if (colorsteps.length == 1)  {
      colorsteps.push({
        color: colorsteps[0].color,
        offset: Length.percent(100),
        cut: false
      })
    }

    this.cachedStepListRect = null;

    this.setState({
      colorsteps,
      index,
      type
    }, false)

    this.refresh();

    this.selectStep(index);

    this.setColorUI()
  }

  template() {
    return `
        <div class='gradient-editor' data-selected-editor='${this.state.type || 'static-gradient'}'>
            <div class='gradient-steps' data-editor='gradient'>
                <div class="hue-container" ref="$back"></div>            
                <div class="hue" ref="$steps">
                    <div class='step-list' ref="$stepList" ></div>
                </div>
            </div>
            <div class='tools' data-editor='tools'>
              <label>Offset <input type='checkbox' ref='$cut' checked />  connected</label>
              <RangeEditor ref='$range' calc="false" key='length' onchange='changeColorStepOffset' />
            </div>
            <div class='sub-editor' ref='$subEditor'> 
              <div data-editor='angle'>
                <label>Angle</label>
                <RangeEditor ref='$angle' calc="false" units="deg" min="-720" max="720" key='angle' onchange='changeKeyValue' />
              </div>
              <div data-editor='centerX'>
                <label>Center X</label>
                <RangeEditor ref='$radialPositionX' calc="false"  key='radialPositionX' onchange='changeKeyValue' />
              </div>                
              <div data-editor='centerY'>           
                <label>Center Y</label>                 
                <RangeEditor ref='$radialPositionY' calc="false" key='radialPositionY' onchange='changeKeyValue' />
              </div>                
              <div data-editor='radialType'>       
                <label>Radial Type</label>              
                <SelectEditor ref='$radialType' value="${this.state.radialType}" options="${radialTypeList.join(',')}" key='radialType' onchange='changeKeyValue' />
              </div>
            </div>            
        </div>
      `;
  }

  [EVENT('changeKeyValue')] (key, value) {

    if (key === 'angle') {
      value = value.value; 
    } 

    this.state[key] = value;

    if (key === 'radialPositionX' || key === 'radialPositionY') {
      this.state['radialPosition'] = [this.state.radialPositionX, this.state.radialPositionY] 
    }

    this.updateData();
  }

  [EVENT('changeColorStepOffset')] (key, value) {
    if (this.currentStep) {
      this.currentStep.offset = value.clone();
      this.$currentStep.css({
        left: this.currentStep.offset
      })  
      this.setColorUI()
      this.updateData();      
    }
  }

  [CLICK('$back')] (e) {
    
    var rect = this.refs.$stepList.rect();
    
    var minX = rect.x;
    var maxX = rect.right;

    var x = e.xy.x 

    if (x < minX)  x = minX
    else if (x > maxX) x = maxX
    var percent = (x - minX) / rect.width * 100;


    var list = this.state.colorsteps.map((it, index) => { 
      return {index, color : it.color, offset: it.offset}
    })

    var prev = list.filter(it => it.offset.value <= percent).pop();
    var next = list.filter(it => it.offset.value >= percent).shift();

    if (prev && next) {
      this.state.colorsteps.splice(next.index, 0, {
        cut: false, 
        offset: Length.percent(percent),
        color: Color.mix(prev.color, next.color, ( percent - prev.offset.value )/(next.offset.value - prev.offset.value))
      })
    } else if (prev) {
      this.state.colorsteps.splice(prev.index+1, 0, {
        cut: false, 
        offset: Length.percent(percent),
        color: 'rgba(0, 0, 0, 1)'
      })      
    } else if (next) {
      this.state.colorsteps.splice(next.index-1, 0, {
        cut: false, 
        offset: Length.percent(percent),
        color: 'rgba(0, 0, 0, 1)'
      })      
    } else {
      this.state.colorsteps.push({
        cut: false, 
        offset: Length.percent(0),
        color: 'rgba(0, 0, 0, 1)'
      })      
    }

    this.refresh();
    this.updateData();
  }

  [BIND('$stepList')] () {
    return {
      'data-selected-index': this.state.index.toString(),
      'style': {
        'background-image' : this.getLinearGradient()
      }
    }
  }

  [LOAD('$stepList')] () {
    return this.state.colorsteps.map( (it, index) => {
      return `<div class='step' data-index='${index}' data-cut='${it.cut}' style='left: ${it.offset};'>
        <div class='color-view' style="background-color: ${it.color}"></div>
        <div class='arrow' style="background-color: ${it.color}"></div>
      </div>`
    })
  }

  [CLICK('$cut')] () {
    if (this.currentStep) {
      this.currentStep.cut = this.refs.$cut.checked()
      this.$currentStep.attr('data-cut', this.currentStep.cut);
      this.setColorUI()
      this.updateData();      
    } 
  }

  removeStep(index) {
    if (this.state.colorsteps.length === 2) return;     
    this.state.colorsteps.splice(index, 1);
    var currentStep = this.state.colorsteps[index]
    var currentIndex = index; 
    if (!currentStep) {
      currentStep = this.state.colorsteps[index-1]
      currentIndex = index - 1; 
    }

    if (currentStep) {
      this.selectStep(currentIndex);
    }
    this.refresh();
    this.updateData();          
  }

  selectStep(index) {
    this.state.index = index; 
    this.currentStep = this.state.colorsteps[index];
    this.$currentStep = this.refs.$stepList.$(`[data-index="${index.toString()}"]`)
    if (this.$currentStep) {
      this.$colorView = this.$currentStep.$('.color-view');
      this.$arrow = this.$currentStep.$('.arrow');
    }
    this.prev = this.state.colorsteps[index-1];
    this.next = this.state.colorsteps[index+1];

  }

  [POINTERSTART('$stepList .step') + MOVE()] (e) {
    var index = +e.$delegateTarget.attr('data-index')

    if (e.altKey) {
      this.removeStep(index);
      return false; 
    } else {

      this.selectStep(index);

      this.startXY = e.xy;
      this.parent.trigger('selectColorStep', this.currentStep.color)
      this.refs.$cut.checked(this.currentStep.cut);
      this.children.$range.setValue(this.currentStep.offset);
      this.refs.$stepList.attr('data-selected-index', index);
      this.cachedStepListRect = this.refs.$stepList.rect();
    }

  }

  getStepListRect () {
    return this.cachedStepListRect;
  }

  move (dx, dy) {

    var rect = this.getStepListRect()
    
    var minX = rect.x;
    var maxX = rect.right;

    var x = this.startXY.x + dx 

    if (x < minX)  x = minX
    else if (x > maxX) x = maxX
    var percent = (x - minX) / rect.width * 100;

    if (this.prev) {
      if (this.prev.offset.value > percent) {
        percent = this.prev.offset.value
      }
    }

    if (this.next) {
      if (this.next.offset.value < percent) {
        percent = this.next.offset.value
      }
    }



    this.currentStep.offset.set(percent);
    this.$currentStep.css({
      left: Length.percent(percent)
    })
    this.children.$range.setValue(this.currentStep.offset);    
    this.setColorUI()
    this.updateData();    
  }


  refresh() {
    this.load();
    this.setColorUI();
  }

  getLinearGradient () {
    if (this.state.colorsteps.length === 0) {
      return '';
    }

    if (this.state.colorsteps.length === 1) {
      var colorstep = this.state.colorsteps[0];
      return `linear-gradient(to right, ${colorstep.color} ${colorstep.offset}, ${colorstep.color} 100%)`
    }

    return `linear-gradient(to right, ${this.state.colorsteps.map((it, index) => {

      if (it.cut) {
        var prev = this.state.colorsteps[index-1]
        if (prev) {
          return `${it.color} ${prev.offset} ${it.offset}`
        } else {
          return `${it.color} ${it.offset}`
        }

      } else {
        return `${it.color} ${it.offset}`
      }

    }).join(',')})`
  }

  setColorUI() {
    this.refs.$stepList.css( "background-image", this.getLinearGradient());
    this.refs.$el.attr( "data-selected-editor", this.state.type);
  }

  [EVENT('setColorStepColor')] (color) {

    if (this.currentStep) {
      this.currentStep.color = color;
      this.$colorView.css({
        'background-color': color
      })
      this.$arrow.css({
        'background-color': color
      })      
      this.setColorUI()
      this.updateData();
    }
  }

  updateData(data = {}) {
    this.setState(data, false);
    this.parent.trigger(this.props.onchange, this.state);
  }

}
