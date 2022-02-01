
import { LOAD, CLICK, POINTERSTART, BIND, PREVENT, DOUBLECLICK, CHANGE, SUBSCRIBE, SUBSCRIBE_SELF, KEYUP, DOMDIFF} from "el/sapa/Event";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";

import './GradientEditor.scss';
import { GradientType, RadialGradientType } from "el/editor/types/model";

export default class GradientEditor extends EditorElement {

  initState() {
    const image = BackgroundImage.parseImage(this.props.value || '') || { type: GradientType.STATIC, colorsteps: [] }

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
  }

  template() {
    return /*html*/`
        <div class='elf--gradient-editor'>
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

  [SUBSCRIBE_SELF('changeTabType')](type) {
    const oldType = this.state.image?.type;
    const colorsteps = this.state.image?.colorsteps || [];

    if (colorsteps.length === 1) {
      colorsteps.push(colorsteps[0])
    }

    if (oldType === GradientType.STATIC) { 
      if (colorsteps.length === 0) {
        colorsteps.push(colorsteps[0], colorsteps[0])
      } else if (colorsteps.length === 1) {
        colorsteps.push(colorsteps[0])
      }
    }

    var url = type === 'image-resource' ? this.state.image.url : this.state.url;
    this.state.image = BackgroundImage.changeImageType({
      type,
      url,
      colorsteps: colorsteps,
      angle: this.state.image.angle || 0,
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
    // this.parent.trigger('changeTabType', type);
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

  [LOAD('$stepList') + DOMDIFF]() {
    var colorsteps = this.state.image?.colorsteps || []
    return colorsteps.map((it, index) => {

      var selected = this.$selection.isSelectedColorStep(it.id) ? 'selected' : '';

      return /*html*/`
      <div class='step ${selected}' data-id='${it.id}' data-cut='${it.cut}' tabindex="-1" style='left: ${it.toLength()};'>
        <div class='color-view' style="background-color: ${it.color}">
          <span>${Math.floor(it.percent * 10)/10}</span>
        </div>      
        <div class='arrow'></div>      
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

    if (this.$config.get('bodyEvent').shiftKey) {
      percent = Math.floor(percent);
    }

    this.currentStep.setValue(percent, rect.width)

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