import BaseProperty from "./BaseProperty";
import {
  LOAD,
  CLICK,
  DROP,
  DRAGSTART,
  PREVENT,
  DRAGOVER,
  DEBOUNCE
} from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { getPredefinedCubicBezier } from "../../../util/functions/bezier";

export default class AnimationProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('animation.property.title');
  }
  getBody() {
    return /*html*/`<div class='animation-list' ref='$animationList'></div>`;
  }

  getTools() {
    return /*html*/`
        <button type="button" ref="$add" title="add Fill">${icon.add}</button>
    `;
  }

  [LOAD("$animationList")]() {
    var current = this.$selection.current;

    if (!current) return '';

    return current.animations.map((it, index) => {

      const selectedClass = it.selected ? "selected" : "";

      if (it.selected) {
        this.selectedIndex = index;
      }

      return /*html*/`
      <div class='animation-group-item'>
        <div class='animation-item ${selectedClass}' data-index='${index}' ref="animationIndex${index}" draggable='true' >
            <div class='timing preview' data-index='${index}' ref='$preview${index}'>
              <canvas class='item-canvas' ref='$itemCanvas${index}' width="30px" height="30px"></canvas>
            </div>
            <div class='name'>
              <div class='title' ref="animationName${index}">
                ${it.name ? it.name : `&lt; ${this.$i18n('animation.property.select a keyframe')} &gt;`}
              </div>
              <div class='labels'>
                <label class='count' title='${this.$i18n('animation.property.iteration.count')}'><small>${it.iterationCount}</small></label>
                <label class='delay' title='${this.$i18n('animation.property.delay')}'><small>${it.delay}</small></label>
                <label class='duration' title='${this.$i18n('animation.property.duration')}'><small>${it.duration}</small></label>
                <label class='direction' title='${this.$i18n('animation.property.direction')}'><small>${it.direction}</small></label>
                <label class='fill-mode' title='${this.$i18n('animation.property.fill.mode')}'><small>${it.fillMode}</small></label>
                <label class='play-state' title='${this.$i18n('animation.property.play.state')}' data-index='${index}' data-play-state-selected-value="${it.playState}">
                  <small data-play-state-value='running'>${icon.play}</small>
                  <small data-play-state-value='paused'>${icon.pause}</small>
                </label>
              </div>
            </div>
            <div class='tools'>
                <button type="button" class="del" data-index="${index}">
                  ${icon.remove2}
                </button>
            </div>
        </div>
      </div>        
      `;
    });
  }

  drawBezierCanvas($canvas, currentBezier) {

    currentBezier = getPredefinedCubicBezier(currentBezier)

    $canvas.update(() => {
        var width = $canvas.width();
        var height = $canvas.height();
        var context = $canvas.context();

        context.lineWidth = 2;
        context.strokeStyle = 'white';

        context.beginPath();
        context.moveTo(0,height);   
        context.bezierCurveTo( 
            currentBezier[0] * width, 
            currentBezier[1] == 0 ? height : (1 - currentBezier[1]) * height, 
            currentBezier[2] * width, 
            currentBezier[3] == 1 ? 0 : (1 - currentBezier[3] ) * height, 
            width, 
            0
        );
        context.stroke();
    })
}

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
    this.emit("hideAnimationPropertyPopup");
  }

  refresh() {
    this.load();
    this.refreshTimingFunctionCanvas()
  }

  refreshTimingFunctionCanvas() {
    var current = this.$selection.current;

    if (!current) return;

    current.animations.forEach( (it, index) => {
      var $canvas = this.getRef('$itemCanvas', index);
      this.drawBezierCanvas($canvas, it.timingFunction);
    })
  }

  [CLICK("$add")](e) {
    var current = this.$selection.current;

    if (current) {
      current.createAnimation({
        name: null
      });
      this.emit("refreshElement", current);
    }

    this.refresh();

    this.emit('refreshInspector');
  }

  [DRAGSTART("$animationList .animation-item")](e) {
    this.startIndex = +e.$dt.attr("data-index");
  }

  
  [DRAGOVER("$animationList .animation-item") + PREVENT](e) {}

  [DROP("$animationList .animation-item") + PREVENT](e) {
    var targetIndex = +e.$dt.attr("data-index");
    var current = this.$selection.current;
    if (!current) return;

    this.selectItem(this.startIndex, true);
    current.sortAnimation(this.startIndex, targetIndex);

    this.emit("refreshElement", current);

    this.refresh();

    
    this.viewAnimationPicker(this.getRef('$preview', this.selectedIndex));
  }

  getCurrentAnimation() {
    return this.current.animations[this.selectedIndex];
  }

  [CLICK("$animationList .tools .del")](e) {
    var removeIndex = e.$dt.attr("data-index");
    var current = this.$selection.current;
    if (!current) return;

    current.removeAnimation(removeIndex);

    this.emit("refreshElement", current);

    this.refresh();
  
  }

  [CLICK('$animationList .play-state')] (e) {
    var index = +e.$dt.attr("data-index");
    var current = this.$selection.current;
    if (!current) return; 

    var animation = current.animations[index]
    if (animation) {
      animation.togglePlayState();

      e.$dt.attr('data-play-state-selected-value', animation.playState)

      this.emit("refreshElement", current);
    }
  }

  
  selectItem(selectedIndex, isSelected = true) {
    if (isSelected) {
      this.refs[`animationIndex${selectedIndex}`].addClass("selected");
    } else {
      this.refs[`animationIndex${selectedIndex}`].removeClass("selected");
    }

    if (this.current) {
      this.current.animations.forEach((it, index) => {
        it.selected = index === selectedIndex;
      });
    }
  }

  viewAnimationPicker($preview) {
    if (typeof this.selectedIndex === "number") {
      this.selectItem(this.selectedIndex, false);
    }

    this.selectedIndex = +$preview.attr("data-index");
    this.selectItem(this.selectedIndex, true);
    this.current = this.$selection.current;

    if (!this.current) return;
    this.currentAnimation = this.current.animations[
      this.selectedIndex
    ];

    this.viewAnimationPropertyPopup();
  }

  viewAnimationPropertyPopup(position) {
    this.current = this.$selection.current;

    if (!this.current) return;
    this.currentAnimation = this.current.animations[
      this.selectedIndex
    ];

    const back = this.currentAnimation;

   
    const name = back.name
    const direction = back.direction
    const duration = back.duration
    const timingFunction = back.timingFunction
    const delay = back.delay
    const iterationCount = back.iterationCount
    const playState = back.playState
    const fillMode = back.fillMode

    this.emit("showAnimationPropertyPopup", {
      name,
      position,
      direction,
      duration,
      timingFunction,
      delay,
      iterationCount,
      playState,
      fillMode
    });
  }

  [CLICK("$animationList .preview")](e) {
    this.viewAnimationPicker(e.$dt);
  }

  getRef(...args) {
    return this.refs[args.join("")];
  }

  refreshAnimationPropertyInfo(image, data) {
    if (data.name) {
      var $element = this.getRef(`animationName`, this.selectedIndex);
      $element.text(data.name);
    } else if (data.width || data.height || data.size) {
      var $element = this.getRef(`size`, this.selectedIndex);

      switch (image.size) {
        case "contain":
        case "cover":
          var text = image.size;
          break;
        default:
          var text = `${image.width}/${image.height}`;
          break;
      }
      $element.text(text);
    } else if (data.repeat) {
      var $element = this.getRef(`repeat`, this.selectedIndex);
      $element.text(data.repeat);
    } else if (data.timingFunction) {
      this.drawBezierCanvas(this.getRef('$itemCanvas', this.selectedIndex), data.timingFunction);
    }
  }

  [EVENT("changeAnimationPropertyPopup")](data) {
    if (this.currentAnimation) {
      this.currentAnimation.reset({ ...data });

      if (this.current) {
        this.emit("refreshElement", this.current);        
        this.refresh();

      }
    }
  }
}
