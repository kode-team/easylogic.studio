
import { LOAD, CLICK, POINTERSTART,  BIND, PREVENT, DOUBLECLICK, CHANGE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import icon, { iconUse } from "el/editor/icon/icon";
import { clone } from "el/sapa/functions/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";

import './GradientEditor.scss';
import { variable } from 'el/sapa/functions/registElement';

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

var iconList = {
  'image-resource': iconUse("photo")
}

var hasRadialPosition = {
  'radial-gradient': true,
  'repeating-radial-gradient': true,
  'conic-gradient': true,
  'repeating-conic-gradient': true
}

var presetPosition = {
  top: [ '50%', '0%' ],
  'top left': [ '0%', '0%' ],
  'top right': [ '100%', '0%' ],
  left: [ '0%', '50%' ],
  right: [ '100%', '50%' ],
  bottom: [ '50%', '100%' ],
  'bottom left': [ '0%', '100%' ],
  'bottom right': [ '100%', '100%' ]
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
              <div class='gradient-view' ref='$gradientView' title='${this.$i18n('gradient.editor.drag.message')}'></div>
              <div class='drag-pointer' ref='$dragPosition'></div>
              <div class='preset-position'>
                <div data-value='top' title='top'>${iconUse("chevron_right")}</div>
                <div data-value='right' title='right'>${iconUse("chevron_right")}</div>
                <div data-value='left' title='left'>${iconUse("chevron_right")}</div>
                <div data-value='bottom' title='bottom'>${iconUse("chevron_right")}</div>
                <div data-value='top left' title='top left'>${iconUse("chevron_right")}</div>
                <div data-value='top right' title='top right'>${iconUse("chevron_right")}</div>
                <div data-value='bottom left' title='bottom left'>${iconUse("chevron_right")}</div>
                <div data-value='bottom right' title='bottom right'>${iconUse("chevron_right")}</div>                
              </div>
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
            <div class='tools' data-editor='tools'>
                <label for='gradientConnected${this.id}'>Connected <input type='checkbox'  id='gradientConnected${this.id}' ref='$cut' checked /></label>
            </div>            
            <div class='tools' data-editor='tools'>
              <object refClass='InputRangeEditor' label="Offset" ref='$range' calc="false" key='length' onchange='changeColorStepOffset' />
            </div>
            <div class='sub-editor' ref='$subEditor'> 
              <div data-editor='angle'>
                <object refClass="InputRangeEditor" label='Angle' ref='$angle' calc="false" units="deg" min="-720" max="720" key='angle' onchange='changeKeyValue' />
              </div>
              <div data-editor='centerX'>
                <object refClass="RangeEditor" label='Center X' ref='$radialPositionX' calc="false" value="50%"  key='radialPositionX' onchange='changeKeyValue' />
              </div>                
              <div data-editor='centerY'>                      
                <object refClass="RangeEditor" label='Center Y' ref='$radialPositionY' calc="false" value="50%" key='radialPositionY' onchange='changeKeyValue' />
              </div>                
              <div data-editor='radialType'>              
                <object refClass="SelectEditor" label='Radial Type' ref='$radialType' value="" options="${variable(radialTypeList)}" key='radialType' onchange='changeKeyValue' />
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


  [CLICK('$el .preset-position [data-value]')] (e) {
    var type = e.$dt.attr('data-value')

    if (presetPosition[type]) {
      this.state.image.radialPosition = clone(presetPosition[type])
      this.refresh();
      this.updateData();
    }

  }

  [DOUBLECLICK('$gradientView') + PREVENT] (e) {
    this.state.image.radialPosition = ['50%', '50%']
    this.refresh();
    this.updateData();
  }

  [POINTERSTART('$gradientView') + MOVE('moveDragPosition') + END('moveEndDragPosition')]  (e) {
    var parent = this.refs.$dragPosition.parent();
    this.containerRect = parent.rect();
    this.startXY = e.xy; 
    this.$config.set('set.move.control.point', true);
  }

  moveEndDragPosition(dx, dy) {
    this.$config.set('set.move.control.point', false);
  }

  moveDragPosition (dx, dy) {
    var x = this.startXY.x + dx; 
    var y = this.startXY.y + dy; 

    if (this.containerRect.x > x) {
      x = this.containerRect.x; 
    } else if (this.containerRect.x + this.containerRect.width < x) {
      x = this.containerRect.x + this.containerRect.width; 
    }

    if (this.containerRect.y > y) {
      y = this.containerRect.y; 
    } else if (this.containerRect.y + this.containerRect.height < y) {
      y = this.containerRect.y + this.containerRect.height; 
    }    

    var left = Length.percent((x - this.containerRect.x ) / this.containerRect.width  * 100) 
    var top = Length.percent((y - this.containerRect.y ) / this.containerRect.height  * 100) 

    this.state.image.radialPosition = [ left, top]

    this.bindData('$dragPosition');
    this.bindData('$gradientView')    
    this.children.$radialPositionX.setValue(left)
    this.children.$radialPositionY.setValue(top)

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
      angle: Length.parse(this.children.$angle.getValue()).value,
      radialType: this.children.$radialType.getValue(),
      radialPosition: [ 
        this.children.$radialPositionX.getValue(), 
        this.children.$radialPositionY.getValue() 
      ] 
    })
    this.refresh();
    this.updateData();
    this.sendMessage();
  }

  sendMessage (type) {
    var type = this.$el.attr('data-selected-editor');
    if (type === 'linear-gradient' || type === 'repeating-linear-gradient') {
      this.emit('addStatusBarMessage', '');
    } else {
      this.emit('addStatusBarMessage', 'Drag if you want to move center position');
    }
  }

  [SUBSCRIBE_SELF('changeKeyValue')] (key, value) {

    if (key === 'angle') {
      value = value.value; 
    } 

    this.state.image[key] = value;

    if (key === 'radialPositionX' || key === 'radialPositionY') {
      this.state.image['radialPosition'] = [
        this.state.image.radialPositionX || '50%', 
        this.state.image.radialPositionY || '50%'
      ] 
    }

    this.bindData('$gradientView')

    this.updateData();
  }

  [SUBSCRIBE('changeColorStepOffset')] (key, value) {
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

  [BIND('$gradientView')] () {

    var type = this.state.image.type;
    var size = 'auto';

    if (type === 'url' || type === 'image-resource') {
      size = 'cover'
    }

    return {
      style: {
        'background-image': this.state.image.toString(),
        'background-size': size,
        'background-repeat': 'no-repeat'
      }
    }
  }

  [BIND('$dragPosition')] () {
    var left = '50%'
    var top = '50%'

    if (hasRadialPosition[this.state.image.type]) {
      var [left, top] = this.state.image.radialPosition;
    }

    return {
      style: {
        left, top 
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

  [CLICK('$cut')] () {
    if (this.currentStep) {

      this.currentStep.cut = this.refs.$cut.checked()

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

    this.$selection.selectColorStep(id);

    if (this.state.image.colorsteps) {
      this.currentStep = this.state.image.colorsteps.find( it => this.$selection.isSelectedColorStep(it.id))
      this.refs.$cut.checked(this.currentStep.cut);
      this.children.$range.setValue(Length.percent(this.currentStep.percent));
      this.parent.trigger('selectColorStep', this.currentStep.color)    
  
    }

    this.refresh();

  }

  [POINTERSTART('$stepList .step') + MOVE()] (e) {
    var id = e.$dt.attr('data-id')

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

    this.currentStep.setValue(percent, rect.width)

    this.children.$range.setValue(Length.percent(percent));    
    this.state.image.sortColorStep();
    this.refresh()

    this.updateData();    
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