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
  CHANGE_SELECTION
} from "../../../../types/event";

import icon from "../../../icon/icon";
import { getPredefinedCubicBezier } from "../../../../../util/functions/bezier";

export default class TransitionProperty extends BaseProperty {
  getTitle() {
    return "Transition";
  }
  getBody() {
    return `<div class='property-item transition-list' ref='$transitionList'></div>`;
  }

  getTools() {
    return `
        <button type="button" ref="$add" title="add Transition">${icon.add}</button>
    `;
  }

  [LOAD("$transitionList")]() {
    var current = editor.selection.current;

    if (!current) return '';

    return current.transitions.map((it, index) => {

      const selectedClass = it.selected ? "selected" : "";

      if (it.selected) {
        this.selectedIndex = index;
      }

      return `
      <div class='transition-group-item'>
        <div class='transition-item ${selectedClass}' data-index='${index}' ref="transitionIndex${index}" draggable='true' >
            <div class='timing preview' data-index='${index}' ref='$preview${index}'>
              <canvas class='item-canvas' ref='$itemCanvas${index}' width="30px" height="30px"></canvas>
            </div>
            <div class='name'>
              <div class='labels'>
                <label class='property' title='Property'>${it.property}</label>                              
                <label class='duration' title='Duration'><small>Duration: ${it.duration}</small></label>
                <label class='delay' title='Delay'><small>Delay: ${it.delay}</small></label>                
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

  [EVENT(CHANGE_SELECTION)]() {
    this.refresh();
    this.emit("hideTransitionPropertyPopup"); 
  }

  refresh() {
    this.load();
    this.refreshTimingFunctionCanvas()
  }

  refreshTimingFunctionCanvas() {
    var current = editor.selection.current;

    if (!current) return;

    current.transitions.forEach( (it, index) => {
      var $canvas = this.getRef('$itemCanvas', index);
      this.drawBezierCanvas($canvas, it.timingFunction);
    })
  }

  [CLICK("$add")](e) {
    var current = editor.selection.current;

    if (current) {
      current.createTransition();
      this.emit("refreshCanvas");
    }

    this.refresh();

    this.emit('refreshCanvas');
  }

  [DRAGSTART("$transitionList .transition-item")](e) {
    this.startIndex = +e.$delegateTarget.attr("data-index");
  }

  // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
  [DRAGOVER("$transitionList .transition-item") + PREVENT](e) {}

  [DROP("$transitionList .transition-item") + PREVENT](e) {
    var targetIndex = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    this.selectItem(this.startIndex, true);
    current.sortTransition(this.startIndex, targetIndex);

    this.emit("refreshCanvas");

    this.refresh();

    // startIndex 가 target 이랑 바뀌면
    // startIndex 객체는 selected 르 true 로 설정하고
    // refresh 될 때 selectedIndex 가 설정 되고
    // viewTransitionPicker 를 호출할 $preview 가 필요하네 ?
    this.viewTransitionPicker(this.getRef('$preview', this.selectedIndex));
  }

  getCurrentTransition() {
    return this.current.transitions[this.selectedIndex];
  }

  [CLICK("$transitionList .tools .del")](e) {
    var removeIndex = e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    current.removeTransition(removeIndex);

    this.emit("refreshCanvas");

    this.refresh();
  
  }

  [CLICK('$transitionList .play-state')] (e) {
    var index = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return; 

    var transition = current.transitions[index]
    if (transition) {
      transition.togglePlayState();

      e.$delegateTarget.attr('data-play-state-selected-value', transition.playState)

      this.emit('refreshCanvas')
    }
  }

  // 객체를 선택하는 괜찮은 패턴이 어딘가에 있을 텐데......
  // 언제까지 selected 를 설정해야하는가?
  selectItem(selectedIndex, isSelected = true) {
    if (isSelected) {
      this.refs[`transitionIndex${selectedIndex}`].addClass("selected");
    } else {
      this.refs[`transitionIndex${selectedIndex}`].removeClass("selected");
    }

    if (this.current) {
      this.current.transitions.forEach((it, index) => {
        it.selected = index === selectedIndex;
      });
    }
  }

  viewTransitionPicker($preview) {
    if (typeof this.selectedIndex === "number") {
      this.selectItem(this.selectedIndex, false);
    }

    this.selectedIndex = +$preview.attr("data-index");
    this.selectItem(this.selectedIndex, true);
    this.current = editor.selection.current;

    if (!this.current) return;
    this.currentTransition = this.current.transitions[
      this.selectedIndex
    ];

    this.viewTransitionPropertyPopup();
  }

  viewTransitionPropertyPopup(position) {
    this.current = editor.selection.current;

    if (!this.current) return;
    this.currentTransition = this.current.transitions[
      this.selectedIndex
    ];

    const back = this.currentTransition;

   
    const property = back.property
    const duration = back.duration
    const timingFunction = back.timingFunction
    const delay = back.delay

    this.emit("showTransitionPropertyPopup", {
      property,
      duration,
      timingFunction,
      delay
    });
  }

  [CLICK("$transitionList .preview")](e) {
    this.viewTransitionPicker(e.$delegateTarget);
  }

  getRef(...args) {
    return this.refs[args.join("")];
  }

  [EVENT("changeTransitionPropertyPopup")](data) {
    if (this.currentTransition) {
      this.currentTransition.reset({ ...data });

      if (this.current) {
        this.emit("refreshCanvas", this.current);

        // 리스트 업데이트 
        this.refresh();
      }
    }
  }
}
