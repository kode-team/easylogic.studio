
import { LOAD, CLICK, POINTERSTART,  BIND, PREVENT, DOUBLECLICK, CHANGE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";

import './GradientEditor.scss';
import { createComponent } from "el/sapa/functions/jsx";

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

var iconList = {
  'image-resource': iconUse("photo")
}

export default class GradientEditor extends EditorElement  {

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
    this.parent.trigger('changeTabType', this.state.image.type);
  }

  template() {

    var { image } = this.state; 

    image = image || {} 

    var type = image.type || 'static-gradient'
    
    if (type === 'url') type = 'image-resource'


    return /*html*/`
        <div class='elf--gradient-editor' data-selected-editor='${type}'>
            <div class='gradient-preview'>
              <div data-editor='image-loader'>
                <input type='file' accept="image/*" ref='$file' />
              </div>              
            </div>
            <div class="picker-tab">
              <div class="picker-tab-list" ref="$tab">
                ${imageTypeList.map(it => {
                  return `<span class='picker-tab-item ${it}' data-editor='${it}'><span class='icon'>${iconList[it] || ''}</span></span>`
                }).join('')}
              </div>
            </div>
            <div class='gradient-steps' data-editor='gradient'>
                <div class="hue-container" ref="$back"></div>            
                <div class="hue" ref="$steps">
                    <div class='step-list' ref="$stepList" ></div>
                </div>
            </div>
        </div>
      `;
  }

  [CHANGE('$file')] (e) {
    var project = this.$selection.currentProject;
    if (project) {
      [...e.target.files].forEach(item => {
        this.emit('updateImageAssetItem', item, (local) => {
          this.trigger('setImageUrl', local);
        });
      })
    }
  }


  [DOUBLECLICK('$gradientView') + PREVENT] (e) {
    this.state.image.radialPosition = ['50%', '50%']
    this.refresh();
    this.updateData();
  }

  [CLICK('$tab .picker-tab-item')] (e) {
    var type = e.$dt.attr('data-editor')
    this.$el.attr('data-selected-editor', type);
    this.parent.trigger('changeTabType', type);

    var url = type === 'image-resource' ? this.state.image.url : this.state.url;
    this.state.image = BackgroundImage.changeImageType({
      type,
      url,
      colorsteps: this.state.image.colorsteps || [] ,   
      angle: this.state.image.angle,
      radialType: this.state.image.radialType,
      radialPosition: this.state.image.radialPosition
    })
    this.refresh();
    this.updateData();
  }

  [SUBSCRIBE_SELF('changeColorStepOffset')] (key, value) {
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
    var type = this.state.image.type;
    if (type === 'url') {
      type = 'image-resource'
    }
    this.parent.trigger('changeTabType', type);
    return {
      "data-selected-editor": type
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

  [LOAD('$stepList')] () {
    var colorsteps = this.state.image.colorsteps || [] 
    return colorsteps.map( (it, index) => {

      var selected = this.$selection.isSelectedColorStep(it.id) ? 'selected' : '';

      return /*html*/`
      <div class='step ${selected}' data-id='${it.id}' data-cut='${it.cut}' style='left: ${it.toLength()};'>
        <div class='color-view' style="background-color: ${it.color}"></div>
        <div class='arrow' style="background-color: ${it.color}"></div>
      </div>`
    })
  }

  removeStep(id) {

    this.state.image.removeColorStep(id);

    this.refresh();
    this.updateData();          
  }

  selectStep(id) {
    this.state.id = id; 

    this.$selection.selectColorStep(id);

    if (this.state.image.colorsteps) {
      this.currentStep = this.state.image.colorsteps.find( it => this.$selection.isSelectedColorStep(it.id))
      this.parent.trigger('selectColorStep', this.currentStep.color)    
  
    }

    this.refresh();

  }

  [POINTERSTART('$stepList .step') + MOVE() + END()] (e) {
    var id = e.$dt.attr('data-id')

    if (e.altKey) {
      this.removeStep(id);
      return false; 
    } else {

      this.isSelectedColorStep = this.$selection.isSelectedColorStep(id);

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

    this.currentStep.setValue(percent, rect.width)

    // this.children.$range.setValue(Length.percent(percent));    
    this.state.image.sortColorStep();
    this.refresh()

    this.updateData();    
  }

  end (dx, dy) {
    if (dx === 0 && dy === 0) {
      if (this.isSelectedColorStep) {
        if (this.currentStep) {

          this.currentStep.cut = !this.currentStep.cut
    
          this.refresh()
          this.updateData();      
        } 
      }
    }
  }


  refresh() {
    this.load();
  }

  getLinearGradient () {

    var { image } = this.state; 

    return `linear-gradient(to right, ${Gradient.toColorString(image.colorsteps)})`;

  }

  [SUBSCRIBE('setColorStepColor')] (color) {

    if (this.state.image.type === 'static-gradient') {
      this.state.image.colorsteps[0].color = color; 
      this.refresh()
      this.updateData();      
    } else {

      if (this.currentStep) {
        this.currentStep.color = color;
        this.refresh()
        this.updateData();
      }
    }

  }


  [SUBSCRIBE('setImageUrl')] (url) {

    if (this.state.image) {
      this.state.url = url; 
      this.state.image.reset({ url });
      this.refresh();
      this.updateData();
    }
  }

  updateData(data = {}) {
    this.setState(data, false);
    this.parent.trigger(this.props.onchange, this.state.image.toString());
  }

}