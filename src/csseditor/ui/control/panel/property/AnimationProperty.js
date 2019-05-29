import BaseProperty from "./BaseProperty";
import {
  LOAD,
  CLICK,
  DROP,
  DRAGSTART,
  PREVENT,
  DRAGOVER
} from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_RECT,
  CHANGE_LAYER,
  CHANGE_ARTBOARD,
  CHANGE_SELECTION,
  CHANGE_INSPECTOR
} from "../../../../types/event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import icon from "../../../icon/icon";
import { getPredefinedCubicBezier } from "../../../../../util/functions/bezier";

export default class AnimationProperty extends BaseProperty {
  getTitle() {
    return "Animation";
  }
  getBody() {
    return `<div class='property-item animation-list' ref='$animationList'></div>`;
  }

  getTools() {
    return `
        <button type="button" ref="$add" title="add Fill">${icon.add}</button>
    `;
  }

  [LOAD("$animationList")]() {
    var current = editor.selection.current;

    if (!current) return EMPTY_STRING;

    return current.animations.map((it, index) => {

      const selectedClass = it.selected ? "selected" : "";

      if (it.selected) {
        this.selectedIndex = index;
      }

      return `
      <div class='animation-group-item'>
        <div class='animation-item ${selectedClass}' data-index='${index}' ref="animationIndex${index}" draggable='true' >
            <div class='timing preview' data-index='${index}' ref='$preview${index}'>
              <canvas class='item-canvas' ref='$itemCanvas${index}' width="30px" height="30px"></canvas>
            </div>
            <div class='name'>
              <div class='title' ref="animationName${index}">
                ${it.name ? it.name : '&lt; select a keyframe &gt;'}
              </div>
              <div class='labels'>
                <label class='count' title='Iteration Count'><small>${it.iterationCount}</small></label>
                <label class='delay' title='Delay'><small>${it.delay}</small></label>
                <label class='duration' title='Duration'><small>${it.duration}</small></label>
                <label class='direction' title='Direction'><small>${it.direction}</small></label>
                <label class='fill-mode' title='Fill Mode'><small>${it.fillMode}</small></label>
                <label class='play-state' title='Play State' data-index='${index}' data-play-state-selected-value="${it.playState}">
                  <small data-play-state-value='running'>${icon.pause}</small>
                  <small data-play-state-value='paused'>${icon.play}</small>
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

        // Draw bezier curve
        context.beginPath();
        context.moveTo(0,height);   // 0, 0
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

  [EVENT(CHANGE_RECT, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
    this.emit("hideAnimationPropertyPopup");
  }

  refresh() {
    this.load();
    this.refreshTimingFunctionCanvas()
  }

  refreshTimingFunctionCanvas() {
    var current = editor.selection.current;

    if (!current) return;

    current.animations.forEach( (it, index) => {
      var $canvas = this.getRef('$itemCanvas', index);
      this.drawBezierCanvas($canvas, it.timingFunction);
    })
  }

  [CLICK("$add")](e) {
    var current = editor.selection.current;

    if (current) {
      current.createAnimation({
        name: null
      });
      this.emit("refreshCanvas");
    }

    this.refresh();

    this.emit(CHANGE_INSPECTOR);
  }

  [DRAGSTART("$animationList .animation-item")](e) {
    this.startIndex = +e.$delegateTarget.attr("data-index");
  }

  // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
  [DRAGOVER("$animationList .animation-item") + PREVENT](e) {}

  [DROP("$animationList .animation-item") + PREVENT](e) {
    var targetIndex = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    this.selectItem(this.startIndex, true);
    current.sortAnimation(this.startIndex, targetIndex);

    this.emit("refreshCanvas");

    this.refresh();

    // startIndex 가 target 이랑 바뀌면
    // startIndex 객체는 selected 르 true 로 설정하고
    // refresh 될 때 selectedIndex 가 설정 되고
    // viewAnimationPicker 를 호출할 $preview 가 필요하네 ?
    this.viewAnimationPicker(this.getRef('$preview', this.selectedIndex));
  }

  getCurrentAnimation() {
    return this.current.animations[this.selectedIndex];
  }

  [CLICK("$animationList .tools .del")](e) {
    var removeIndex = e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    current.removeAnimation(removeIndex);

    this.emit("refreshCanvas");

    this.refresh();
  
  }

  [CLICK('$animationList .play-state')] (e) {
    var index = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return; 

    var animation = current.animations[index]
    if (animation) {
      animation.togglePlayState();

      e.$delegateTarget.attr('data-play-state-selected-value', animation.playState)

      this.emit('refreshCanvas')
    }
  }

  // 객체를 선택하는 괜찮은 패턴이 어딘가에 있을 텐데......
  // 언제까지 selected 를 설정해야하는가?
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
    this.current = editor.selection.current;

    if (!this.current) return;
    this.currentAnimation = this.current.animations[
      this.selectedIndex
    ];

    this.viewAnimationPropertyPopup();
  }

  viewAnimationPropertyPopup(position) {
    this.current = editor.selection.current;

    if (!this.current) return;
    this.currentAnimation = this.current.animations[
      this.selectedIndex
    ];

    const back = this.currentAnimation;

   
    
    const direction = back.direction
    const duration = back.duration
    const timingFunction = back.timingFunction
    const delay = back.delay
    const iterationCount = back.iterationCount
    const playState = back.playState
    const fillMode = back.fillMode

    this.emit("showAnimationPropertyPopup", {
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
    this.viewAnimationPicker(e.$delegateTarget);
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
        this.emit("refreshCanvas", this.current);

        // 리스트 업데이트 
        this.refresh();
        // this.refreshAnimationPropertyInfo(this.currentAnimation, data);
      }
    }
  }
}
