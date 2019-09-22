import UIElement, { EVENT } from "../../../util/UIElement";
import { LOAD, CLICK, POINTERSTART, MOVE, END, BIND } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import Color from "../../../util/Color";
import RangeEditor from "./RangeEditor";
import { convertMatches, reverseMatches } from "../../../util/functions/parser";

import SelectEditor from "./SelectEditor";
import InputRangeEditor from "./InputRangeEditor";
import { BackgroundImage } from "../../../editor/css-property/BackgroundImage";
import { LinearGradient } from "../../../editor/image-resource/LinearGradient";
import { editor } from "../../../editor/editor";

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

var imageTypeList = [
  'static-gradient',
  'linear-gradient',
  'repeating-linear-gradient',
  'radial-gradient',
  'repeating-radial-gradient',
  'conic-gradient',
  'repeating-conic-gradient',
  'image-resource'
]

export default class GradientEditor extends UIElement  {

  components() {
    return {
      InputRangeEditor,
      RangeEditor,
      SelectEditor
    }
  }

  initState() {

    return {
      index: +(this.props.index || 0 ),
      value: this.props.value, 
      image: BackgroundImage.parseImage(this.props.value || '') || { type: '', colorsteps: [] } 
    }
  }

  setValue (value) {
    this.setState({
      image: BackgroundImage.parseImage(value)
    }, false)

    this.refresh();
  }

  template() {

    var { image } = this.state; 

    image = image || {} 

    return /*html*/`
        <div class='gradient-editor' data-selected-editor='${image.type || 'static-gradient'}'>
            <div class='gradient-preview'>
              <div class='gradient-view' ref='$gradientView'></div>
            </div>
            <div class="picker-tab">
              <div class="picker-tab-list" ref="$tab">
                ${imageTypeList.map(it => {
                  return `<span class='picker-tab-item ${it}' data-editor='${it}'><span class='icon'></span></span>`
                }).join('')}
              </div>
            </div>
            <div class='gradient-steps' data-editor='gradient'>
                <div class="hue-container" ref="$back"></div>            
                <div class="hue" ref="$steps">
                    <div class='step-list' ref="$stepList" ></div>
                </div>
            </div>
            <div class='tools' data-editor='tools'>
              <label>Offset <input type='checkbox' ref='$cut' checked />  connected</label>
              <InputRangeEditor ref='$range' calc="false" key='length' onchange='changeColorStepOffset' />
            </div>
            <div class='sub-editor' ref='$subEditor'> 
              <div data-editor='angle'>
                <RangeEditor label='Angle' ref='$angle' calc="false" units="deg" min="-720" max="720" key='angle' onchange='changeKeyValue' />
              </div>
              <div data-editor='centerX'>
                <RangeEditor label='Center X' ref='$radialPositionX' calc="false"  key='radialPositionX' onchange='changeKeyValue' />
              </div>                
              <div data-editor='centerY'>                      
                <RangeEditor label='Center Y' ref='$radialPositionY' calc="false" key='radialPositionY' onchange='changeKeyValue' />
              </div>                
              <div data-editor='radialType'>              
                <SelectEditor label='Radial Type' ref='$radialType' value="" options="${radialTypeList.join(',')}" key='radialType' onchange='changeKeyValue' />
              </div>
            </div>            
        </div>
      `;
  }

  [CLICK('$tab .picker-tab-item')] (e) {
    var type = e.$delegateTarget.attr('data-editor')
    this.$el.attr('data-selected-editor', type);
    this.state.image = BackgroundImage.changeImageType({
      type,
      colorsteps: this.state.image.colorsteps,   
      angle: Length.parse(this.children.$angle.getValue()).value,
      radialType: this.children.$radialType.getValue(),
      radialPosition: [ this.children.$radialPositionX.getValue(), this.children.$radialPositionY.getValue() ] 
    })
    this.refresh();
    this.updateData();
  }

  [EVENT('changeKeyValue')] (key, value) {

    if (key === 'angle') {
      value = value.value; 
    } 

    this.state.image[key] = value;

    if (key === 'radialPositionX' || key === 'radialPositionY') {
      this.state.image['radialPosition'] = [
        this.state.image.radialPositionX || 'center', 
        this.state.image.radialPositionY || 'center'
      ] 
    }

    this.bindData('$gradientView')

    this.updateData();
  }

  [EVENT('changeColorStepOffset')] (key, value) {
    if (this.currentStep) {
      this.currentStep.percent = value.value;
      this.state.image.sortColorStep();
      this.refresh()
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

    this.state.image.insertColorStep(percent);
    this.state.image.sortColorStep()

    this.refresh();
    this.updateData();
  }

  [BIND('$el')] () {
    return {
      "data-selected-editor": this.state.image.type
    }
  }

  [BIND('$stepList')] () {
    return {
      'data-selected-index': this.state.index.toString(),
      'style': {
        'background-image' : this.getLinearGradient()
      }
    }
  }

  [BIND('$gradientView')] () {
    return {
      style: {
        'background-image': this.state.image.toString()
      }
    }
  }

  [LOAD('$stepList')] () {
    return this.state.image.colorsteps.map( (it, index) => {

      var selected = editor.selection.isSelectedColorStep(it.id) ? 'selected' : '';

      return /*html*/`
      <div class='step ${selected}' data-id='${it.id}' style='left: ${it.percent}%;'>
        <div class='color-view' style="background-color: ${it.color}"></div>
        <div class='arrow' style="background-color: ${it.color}"></div>
      </div>`
    })
  }

  [CLICK('$cut')] () {
    if (this.currentStep) {

      this.currentStep.cut = this.refs.$cut.checked()
      // this.$currentStep.attr('data-cut', this.currentStep.cut);
      this.refresh()
      this.updateData();      
    } 
  }

  removeStep(id) {

    this.state.image.removeColorStep(id);

    this.refresh();
    this.updateData();          
  }

  selectStep(id) {
    this.state.id = id; 

    editor.selection.selectColorStep(id);

    this.currentStep = this.state.image.colorsteps.find( it => editor.selection.isSelectedColorStep(it.id))


    this.refresh();

    this.refs.$cut.checked(this.currentStep.cut);
    this.children.$range.setValue(Length.percent(this.currentStep.percent));
    this.parent.trigger('selectColorStep', this.currentStep.color)    

  }

  [POINTERSTART('$stepList .step') + MOVE()] (e) {
    var id = e.$delegateTarget.attr('data-id')

    if (e.altKey) {
      this.removeStep(id);
      return false; 
    } else {

      this.selectStep(id);

      this.startXY = e.xy;

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


    this.currentStep.percent = percent;
    // this.$currentStep.css({
    //   left: Length.percent(percent)
    // })
    this.children.$range.setValue(Length.percent(percent));    
    this.state.image.sortColorStep();
    this.refresh()
    // console.log(this.state.image.toString());
    // this.bindData('$gradientView');
    // this.bindData('$stepList');
    this.updateData();    
  }


  refresh() {
    this.load();
    // this.setColorUI();
  }

  getLinearGradient () {

    var { image } = this.state; 

    return LinearGradient.toLinearGradient(image.colorsteps);

  }

  setColorUI() {
    // this.refs.$stepList.css( "background-image", this.getLinearGradient());

  }

  [EVENT('setColorStepColor')] (color) {

    if (this.currentStep) {
      this.currentStep.color = color;
      this.refresh()
      this.updateData();
    }
  }

  updateData(data = {}) {
    this.setState(data, false);
    this.parent.trigger(this.props.onchange, this.state.image.toString());
  }

}
