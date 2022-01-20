
import { LOAD, CLICK, POINTERSTART, BIND, PREVENT, DOUBLECLICK, CHANGE, SUBSCRIBE, SUBSCRIBE_SELF, KEYUP, DOMDIFF} from "el/sapa/Event";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";

import './GradientEditor.scss';
import { RadialGradientType } from "el/editor/types/model";

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

export default class GradientEditor extends EditorElement {

  initState() {
    const image = BackgroundImage.parseImage(this.props.value || '') || { type: 'static-gradient', colorsteps: [] }

    const id = image.colorsteps[this.props.index]?.id;
    this.$selection.selectColorStep(id);

    if (id) {
      this.currentStep = image.colorsteps.find(it => this.$selection.isSelectedColorStep(it.id))
    }

    return {
      id,
      index: +(this.props.index || 0),
      value: this.props.value,
      image,
    }
  }

  setValue(value) {
    this.setState({
      image: BackgroundImage.parseImage(value)
    }, false)

    this.refresh();
    this.parent.trigger('changeTabType', this.state.image.type);
  }

  template() {
    return /*html*/`
        <div class='elf--gradient-editor'>
            <div class='gradient-preview'>
              <div data-editor='image-loader'>
                <input type='file' accept="image/*" ref='$file' />
              </div>              
            </div>
            <div class="picker-tab">
              <div class="picker-tab-list" ref="$tab"></div>
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

  [CHANGE('$file')](e) {
    var project = this.$selection.currentProject;
    if (project) {
      [...e.target.files].forEach(item => {
        this.emit('updateImageAssetItem', item, (local) => {
          this.trigger('setImageUrl', local);
        });
      })
    }
  }


  [DOUBLECLICK('$gradientView') + PREVENT](e) {
    this.state.image.radialPosition = ['50%', '50%']
    this.refresh();
    this.updateData();
  }

  [CLICK('$tab .picker-tab-item')](e) {
    var type = e.$dt.attr('data-editor')
    e.$dt.onlyOneClass('selected');

    // this.$el.attr('data-selected-editor', type);
    this.parent.trigger('changeTabType', type);

    const colorsteps = this.state.image.colorsteps || [];

    if (colorsteps.length === 1) {
      colorsteps.push(colorsteps[0])
    }

    var url = type === 'image-resource' ? this.state.image.url : this.state.url;
    this.state.image = BackgroundImage.changeImageType({
      type,
      url,
      colorsteps: colorsteps,
      angle: this.state.image.angle,
      radialType: this.state.image.radialType || RadialGradientType.CIRCLE,
      radialPosition: this.state.image.radialPosition || ['50%', '50%']
    })
    this.refresh();
    this.updateData();
  }

  [SUBSCRIBE_SELF('changeColorStepOffset')](key, value) {
    if (this.currentStep) {
      this.currentStep.percent = value.value;
      this.state.image.sortColorStep();
      this.refresh()
      this.updateData();
    }
  }

  [CLICK('$back')](e) {
    var rect = this.refs.$stepList.rect();

    var minX = rect.x;
    var maxX = rect.right;

    var x = e.xy.x

    if (x < minX) x = minX
    else if (x > maxX) x = maxX
    var percent = (x - minX) / rect.width * 100;

    this.state.image.insertColorStep(percent);
    this.state.image.sortColorStep()

    this.refresh();
    this.updateData();
  }

  [BIND('$el')]() {
    var type = this.state.image.type;
    if (type === 'url') {
      type = 'image-resource'
    }
    this.parent.trigger('changeTabType', type);
    return {
      "data-selected-editor": type
    }
  }

  [BIND('$stepList')]() {
    return {
      'style': {
        'background-image': this.getLinearGradient()
      }

    }
  }

  [LOAD('$tab')]() {

    var { image } = this.state;

    image = image || {}

    var type = image.type || 'static-gradient'

    if (type === 'url') type = 'image-resource'

    return imageTypeList.map(it => {
      const selected = type === it ? 'selected' : '';
      return /*html*/`<span class='picker-tab-item ${it} ${selected}' data-editor='${it}'><span class='icon'>${iconList[it] || ''}</span></span>`
    });
  }

  [LOAD('$stepList') + DOMDIFF]() {
    var colorsteps = this.state.image.colorsteps || []
    return colorsteps.map((it, index) => {

      var selected = this.$selection.isSelectedColorStep(it.id) ? 'selected' : '';

      return /*html*/`
      <div class='step ${selected}' data-id='${it.id}' data-cut='${it.cut}' tabindex="-1" style='left: ${it.toLength()};'>
        <div class='arrow' style="background-color: ${it.color}"></div>      
        <div class='color-view' style="background-color: ${it.color}"></div>
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
      this.currentStep = this.state.image.colorsteps.find(it => this.$selection.isSelectedColorStep(it.id))
      this.parent.trigger('selectColorStep', this.currentStep.color)

    }

    this.refresh();

  }


  [KEYUP('$el .step')](e) {
    const id = e.$dt.data('id');
    switch (e.code) {
      case 'Delete':
      case 'Backspace':
        this.removeStep(id);
        break;
      case 'BracketRight':
        this.sortToRight(id);
        break;
      case 'BracketLeft':
        this.sortToLeft(id);
        break;
      case 'Equal':
        this.appendColorStep(id);
        break;
      case 'Minus':
        this.prependColorStep(id);
        break;
    }
  }


  sortToRight(id) {
    this.state.image.sortToRight();

    this.refresh();
    this.updateData();

    this.doFocus(id)
  }

  sortToLeft(id) {
    this.state.image.sortToLeft();

    this.refresh();
    this.updateData();

    this.doFocus(id)
  }


  appendColorStep(id) {

    const currentIndex = this.state.image.colorsteps.findIndex(it => it.id === id);
    const nextIndex = currentIndex + 1;

    const currentColorStep = this.state.image.colorsteps[currentIndex];
    const nextColorStep = this.state.image.colorsteps[nextIndex];

    if (!nextColorStep) {
      if (currentColorStep.percent !== 100) {
        this.state.image.insertColorStep(currentColorStep.percent + (100 - currentColorStep.percent) / 2);
      }
    } else {
      this.state.image.insertColorStep(currentColorStep.percent + (nextColorStep.percent - currentColorStep.percent) / 2);
    }

    this.refresh();
    this.updateData();

    this.doFocus(id);
  }

  doFocus(id) {

    this.nextTick(() => {
      this.refs.$stepList.$(".step[data-id='" + id + "']").focus();
    }, 100)
  }

  prependColorStep(id) {
    const currentIndex = this.state.image.colorsteps.findIndex(it => it.id === id);
    const prevIndex = currentIndex - 1;

    const currentColorStep = this.state.image.colorsteps[currentIndex];
    const prevColorStep = this.state.image.colorsteps[prevIndex];

    if (!prevColorStep) {
      if (currentColorStep.percent !== 0) {
        this.state.image.insertColorStep(currentColorStep.percent);
      }
    } else {
      this.state.image.insertColorStep(prevColorStep.percent + (currentColorStep.percent - prevColorStep.percent) / 2);
    }

    this.refresh();
    this.updateData();

    this.doFocus(id);

  }

  [POINTERSTART('$stepList .step') + MOVE() + END()](e) {
    var id = e.$dt.attr('data-id')

    if (e.altKey) {
      this.removeStep(id);
      return false;
    } else {
      e.$dt.focus();
      this.isSelectedColorStep = this.$selection.isSelectedColorStep(id);

      this.selectStep(id);

      this.startXY = e.xy;

      this.cachedStepListRect = this.refs.$stepList.rect();
    }

  }

  getStepListRect() {
    return this.cachedStepListRect;
  }

  move(dx, dy) {

    var rect = this.getStepListRect()

    var minX = rect.x;
    var maxX = rect.right;

    var x = this.startXY.x + dx

    if (x < minX) x = minX
    else if (x > maxX) x = maxX
    var percent = (x - minX) / rect.width * 100;

    this.currentStep.setValue(percent, rect.width)

    // this.children.$range.setValue(Length.percent(percent));    
    this.state.image.sortColorStep();
    this.refresh()

    this.updateData();
  }

  end(dx, dy) {
    if (dx === 0 && dy === 0) {
      if (this.isSelectedColorStep) {
        if (this.currentStep) {

          this.currentStep.cut = !this.currentStep.cut

          this.refresh()
          this.updateData();
        }
      }
    }


    this.doFocus(this.state.id);
  }

  getLinearGradient() {

    var { image } = this.state;

    return `linear-gradient(to right, ${Gradient.toColorString(image.colorsteps)})`;

  }

  [SUBSCRIBE_SELF('setColorStepColor')](color) {

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


  [SUBSCRIBE('setImageUrl')](url) {

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