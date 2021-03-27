import UIElement, { EVENT } from "@sapa/UIElement";
import { LOAD, CLICK, POINTERSTART, MOVE, BIND, CHANGE } from "@sapa/Event";
import { Length } from "@unit/Length";
import "./RangeEditor";

import "./SelectEditor";
import "./InputRangeEditor";
import { Gradient } from "@property-parser/image-resource/Gradient";
import icon from "@icon/icon";
import { SVGFill } from "@property-parser/SVGFill";
import { SVGStaticGradient } from "@property-parser/image-resource/SVGStaticGradient";
import { isUndefined } from "@sapa/functions/func";
import "./SelectIconEditor";
import { registElement } from "@sapa/registerElement";

const imageTypeList = [
  'static-gradient',
  'linear-gradient',
  'radial-gradient',
  'image-resource'
]

const iconList = {
  'image-resource': icon.photo
}


const presetPosition = {
  top: { x1: '0%', y1: '100%', x2: '0%', y2: '0%'},
  'top left': { x1: '100%', y1: '100%', x2: '0%', y2: '0%'},
  'top right': { x1: '0%', y1: '100%', x2: '100%', y2: '0%'},
  left: { x1: '100%', y1: '0%', x2: '0%', y2: '0%'},
  right: { x1: '0%', y1: '0%', x2: '100%', y2: '0%'},
  bottom: { x1: '0%', y1: '0%', x2: '0%', y2: '100%'},
  'bottom left': { x1: '100%', y1: '0%', x2: '0%', y2: '100%'},
  'bottom right': { x1: '0%', y1: '0%', x2: '100%', y2: '100%'}
}

const props = [
  'x1', 'y1', 'x2', 'y2', 
  'cx', 'cy', 'r', 
  'fx', 'fy', 'fr', 
  'spreadMethod',  
  'patternUnits', 'patternWidth', 'patternHeight',
  'imageX', 'imageY', 'imageWidth', 'imageHeight'
]

const rangeEditorList = [
  'x1', 'y1', 'x2', 'y2', 
  'cx', 'cy', 'r', 
  'fx', 'fy', 'fr', 
  'patternWidth', 'patternHeight',
  'imageX', 'imageY', 'imageWidth', 'imageHeight'
]

export default class FillEditor extends UIElement  {

  initState() {
    return {
      cachedRect: null,
      index: +(this.props.index || 0 ),
      value: this.props.value, 
      image: SVGFill.parseImage(this.props.value || 'transparent') || SVGStaticGradient.create()
    }
  }

  setValue (value) {
    this.setState({
      cachedRect: null,
      image: SVGFill.parseImage(value)
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
        <div class='fill-editor' data-selected-editor='${type}'>
            <div class='gradient-preview'>
              <div class='gradient-view' ref='$gradientView'>
                <div class='drag-pointer' ref='$dragPosition'></div>
              </div>
              <svg class='pointer-draw' ref='$pointerDrawArea'>
                <line data-type='line' ref='$line' />
                <circle r='5' data-type='start' ref='$startPoint' />
                <circle r='5' data-type='end' ref='$endPoint' />
                <circle r='5' data-type='center' ref='$centerPoint' />
                <circle r='5' data-type='f' ref='$fPoint' />
              </svg>              
              <div class='preset-position'>
                <div data-value='top' title='top'>${icon.chevron_right}</div>
                <div data-value='right' title='right'>${icon.chevron_right}</div>
                <div data-value='left' title='left'>${icon.chevron_right}</div>
                <div data-value='bottom' title='bottom'>${icon.chevron_right}</div>
                <div data-value='top left' title='top left'>${icon.chevron_right}</div>
                <div data-value='top right' title='top right'>${icon.chevron_right}</div>
                <div data-value='bottom left' title='bottom left'>${icon.chevron_right}</div>
                <div data-value='bottom right' title='bottom right'>${icon.chevron_right}</div>                
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
              <object refClass="RangeEditor"  label='${this.$i18n('fill.editor.offset')}' ref='$range' key='length' onchange='changeColorStepOffset' />
            </div>
            <div class='sub-editor' ref='$subEditor'> 
                <div data-editor='spreadMethod'>
                  <object refClass="SelectIconEditor" label='${this.$i18n('fill.editor.spread')}' ref='$spreadMethod' value="pad" options='pad,reflect,repeat' key='spreadMethod' onchange='changeKeyValue' />
                </div>  
                <div data-editor='patternUnits'>
                  <object refClass="SelectEditor"  label='Pattern' ref='$patternUnits' options='userSpaceOnUse' key='patternUnits' onchange='changeKeyValue' />
                </div>                  
                ${rangeEditorList.map(field => {
                  const label = this.$i18n('fill.editor.' + field)
                  return /*html*/`
                    <div data-editor='${field}'>
                      <object refClass="RangeEditor"  label='${label}' ref='$${field}' value="${this.getImageFieldValue(image, field)}" key='${field}' onchange='changeKeyValue' />
                    </div>
                  `
                }).join('')}
                                                                                                                                
            </div>            
        </div>
      `;
  }

  getImageFieldValue(image, field) {
    var value = image[field]

    if (isUndefined(value)) {
      switch(field) {
      case 'cx':
      case 'cy':
      case 'r':        
      case 'fx':
      case 'fy':        
        return '50%'    
      case 'x1':
      case 'y1': 
      case 'y2': 
      case 'fr':
      case 'imageX':
      case 'imageY':
        return '0%';
      case 'x2':
      case 'patternWidth':
      case 'patternHeight':
      case 'imageWidth':
      case 'imageHeight':        
        return '100%';    
      }
    }

    return value; 
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
      this.state.image.reset(presetPosition[type])
      this.refresh();
      this.refreshFieldValue();
      this.updateData();
    }

  }

  refreshFieldValue() {
    this.children.$x1.setValue(this.state.image.x1)
    this.children.$y1.setValue(this.state.image.y1)
    this.children.$x2.setValue(this.state.image.x2)
    this.children.$y2.setValue(this.state.image.y2)

    this.children.$cx.setValue(this.state.image.cx)
    this.children.$cy.setValue(this.state.image.cy)
    this.children.$r.setValue(this.state.image.r)

    this.children.$fx.setValue(this.state.image.fx)
    this.children.$fy.setValue(this.state.image.fy)
    this.children.$fr.setValue(this.state.image.fr)  
    
    this.children.$spreadMethod.setValue(this.state.image.spreadMethod);
    this.children.$patternUnits.setValue(this.state.image.patternUnits);
    this.children.$patternWidth.setValue(this.state.image.patternWidth);
    this.children.$patternHeight.setValue(this.state.image.patternHeight);
    this.children.$imageX.setValue(this.state.image.imageX);
    this.children.$imageY.setValue(this.state.image.imageY);
    this.children.$imageWidth.setValue(this.state.image.imageWidth);        
    this.children.$imagenHeight.setValue(this.state.image.imageHeight);
  }

  getDrawAreaRect () {
    return {width: 198, height: 150};
  }

  getFieldValue(field) {
    return Length.parse(this.getImageFieldValue(this.state.image, field));
  }

  [BIND('$line')] () {
    var {width, height} = this.getDrawAreaRect()

    var x1 = this.getFieldValue('x1').toPx(width)
    var y1 = this.getFieldValue('y1').toPx(height)
    var x2 = this.getFieldValue('x2').toPx(width)
    var y2 = this.getFieldValue('y2').toPx(height)    

    return { x1, y1, x2, y2 }
  }


  [BIND('$startPoint')] () {
    var {width, height} = this.getDrawAreaRect()

    var cx = this.getFieldValue('x1').toPx(width)
    var cy = this.getFieldValue('y1').toPx(height)

    return { cx, cy }
  }  

  [BIND('$endPoint')] () {
    var {width, height} = this.getDrawAreaRect()

    var cx = this.getFieldValue('x2').toPx(width)
    var cy = this.getFieldValue('y2').toPx(height)

    return { cx, cy }
  }  

  [BIND('$centerPoint')] () {
    var {width, height} = this.getDrawAreaRect()

    var cx = this.getFieldValue('cx').toPx(width)
    var cy = this.getFieldValue('cy').toPx(height)

    return { cx, cy }
  }  

  [BIND('$fPoint')] () {
    var {width, height} = this.getDrawAreaRect()

    var cx = this.getFieldValue('fx').toPx(width)
    var cy = this.getFieldValue('fy').toPx(height)


    return { cx, cy }
  }    

  [POINTERSTART('$pointerDrawArea circle[data-type]') + MOVE('moveDragPointer')]  (e) {
    this.containerRect = this.refs.$pointerDrawArea.rect();
    this.startXY = e.xy; 
    this.type = e.$dt.attr('data-type');
    this.state.cachedRect = null; 
  }

  getRectRate (rect, x, y) {

    var {width, height, x:rx, y: ry } = rect

    if (rx > x) {
      x = rx; 
    } else if (rx + width < x) {
      x = rx + width; 
    }

    if (ry > y) {
      y = ry; 
    } else if (ry + height < y) {
      y = ry + height; 
    }    

    var left = Length.percent((x - rx ) / width  * 100) 
    var top = Length.percent((y - ry ) / height  * 100) 

    return {left, top}
  }

  moveDragPointer (dx, dy) {
    var x = this.startXY.x + dx; 
    var y = this.startXY.y + dy; 

    var {left, top } = this.getRectRate(this.containerRect, x, y);

    if (this.type == 'start') {
      this.state.image.reset({ x1: left, y1: top })
      this.children.$x1.setValue(left)
      this.children.$y1.setValue(top)            

      this.bindData('$startPoint')
      this.bindData('$line')

    } else if (this.type == 'end') {
      this.state.image.reset({ x2: left, y2: top })
      this.children.$x2.setValue(left)
      this.children.$y2.setValue(top)      
      this.bindData('$endPoint')
      this.bindData('$line')      
    } else if (this.type == 'center') {
      this.state.image.reset({ cx: left, cy: top })
      this.children.$cx.setValue(left)
      this.children.$cy.setValue(top)      
      this.bindData('$centerPoint')
    } else if (this.type == 'f') {
      this.state.image.reset({ fx: left, fy: top })            
      this.children.$fx.setValue(left)
      this.children.$fy.setValue(top)      
      this.bindData('$fPoint')      
    }

    this.bindData('$gradientView')    


    this.updateData();
  }

  [CLICK('$tab .picker-tab-item')] (e) {
    var type = e.$dt.attr('data-editor')
    this.$el.attr('data-selected-editor', type);
    this.parent.trigger('changeTabType', type);

    var url = type === 'image-resource' ? this.state.image.url : this.state.url;
    var opt = {}
    
    props.forEach(it => {
      opt[it] = this.children[`$${it}`].getValue()
    })

    this.state.image = SVGFill.changeImageType({
      type,
      url,
      colorsteps: this.state.image.colorsteps || [] ,   
      ...opt
    })
    this.refresh();
    this.updateData();
    this.sendMessage();
  }

  sendMessage (type) {
    var type = this.$el.attr('data-selected-editor');
    if (type === 'linear-gradient') {
      this.emit('addStatusBarMessage', '');
    } else if (type === 'url' || type === 'image-resource') {
      this.emit('addStatusBarMessage', this.$i18n('fill.editor.message.click.image'));
    } else {
      this.emit('addStatusBarMessage', this.$i18n('fill.editor.message.drag.position'));
    }
  }

  [EVENT('changeKeyValue')] (key, value) {

    this.state.image.reset({
      [key]: value
    })

    this.bindData('$gradientView')
    this.bindData('$line')
    this.bindData('$startPoint')
    this.bindData('$endPoint')
    this.bindData('$centerPoint')
    this.bindData('$fPoint')

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

  get fillId () {
    return this.id + 'fill';
  }

  [BIND('$gradientView')] () {
    return {
      innerHTML : /*html*/`
        <svg x="0" y="0" width="100%" height="100%">
          <defs>
            ${this.state.image.toSVGString(this.fillId)}
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="${this.state.image.toFillValue(this.fillId)}" />
        </svg>
      `
    }
  }

  [LOAD('$stepList')] () {
    var colorsteps = this.state.image.colorsteps || [] 
    return colorsteps.map( (it, index) => {

      var selected = this.$selection.isSelectedColorStep(it.id) ? 'selected' : '';
      return /*html*/`
      <div class='step ${selected}' data-id='${it.id}' style='left: ${it.percent}%;'>
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


    this.currentStep.percent = percent;

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

  [EVENT('setColorStepColor')] (color) {

    if (this.state.image.type === 'static-gradient') {
      this.state.image.setColor(color)
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


  [EVENT('setImageUrl')] (url) {

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

registElement({ FillEditor })