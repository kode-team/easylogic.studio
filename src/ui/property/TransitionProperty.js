import BaseProperty from "./BaseProperty";
import {
  LOAD,
  CLICK,
  DOMDIFF,
} from "@core/Event";
import { EVENT } from "@core/UIElement";


import icon from "@icon/icon";
import { Transition } from "@property-parser/Transition";
import { curveToPath } from "@core/functions/func";

export default class TransitionProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('transition.property.title');
  }

  getBody() {
    return /*html*/`<div class='transition-list' ref='$transitionList'></div>`;
  }

  getTools() {
    return /*html*/`
        <button type="button" ref="$add" title="add Transition">${icon.add}</button>
    `;
  }

  [LOAD("$transitionList") + DOMDIFF]() {
    var current = this.$selection.current;

    if (!current) return '';

    return Transition.parseStyle(current.transition).map((it, index) => {

      const selectedClass = this.state.selectedIndex === index ? "selected" : "";
      const path = curveToPath(it.timingFunction, 30, 30)

      return /*html*/`
      <div class='transition-group-item'>
        <div class='transition-item ${selectedClass}' data-index='${index}' ref="transitionIndex${index}">
            <div class='timing preview' data-index='${index}' ref='$preview${index}'>
              <svg class='item-canvas' width="30" height="30" viewBox="0 0 30 30">
                <path d="${path}" stroke="white" stroke-width="1" fill='none' />
              </svg>
            </div>
            <div class='name'>
              <div class='labels'>
                <span class='property-name' title='Property'>${it.name}</span>
                <span class='duration' title='Duration'><small>Duration: ${it.duration}</small></span>
                <span class='delay' title='Delay'><small>Delay: ${it.delay}</small></span>
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

  [EVENT('refreshSelection')]() {
    this.refreshShowIsNot(['project']);
  }


  [CLICK("$add")](e) {
    var current = this.$selection.current;

    if (current) {

      current.reset({
        transition: Transition.add(current.transition)
      })

      this.emit("refreshElement", current);
    }

    this.refresh();

  }


  getCurrentTransition() {
    return this.current.transitions[this.selectedIndex];
  }

  [CLICK("$transitionList .tools .del")](e) {
    var removeIndex = e.$dt.attr("data-index");
    var current = this.$selection.current;
    if (!current) return;

    current.reset({
      transition: Transition.remove(current.transition, removeIndex)
    })  

    this.emit("refreshElement", current);

    this.refresh();    
  
  }

  // 객체를 선택하는 괜찮은 패턴이 어딘가에 있을 텐데......
  // 언제까지 selected 를 설정해야하는가?
  selectItem(selectedIndex, isSelected = true) {
    if (isSelected) {
      this.refs[`transitionIndex${selectedIndex}`].addClass("selected");
    } else {
      this.refs[`transitionIndex${selectedIndex}`].removeClass("selected");
    }
  }

  viewTransitionPicker($preview) {
    if (typeof this.selectedIndex === "number") {
      this.selectItem(this.selectedIndex, false);
    }



    this.selectedIndex = +$preview.attr("data-index");
    this.current = this.$selection.current;

    if (!this.current) return;
    this.currentTransition = Transition.get(this.current.transition, this.selectedIndex);

    this.viewTransitionPropertyPopup();
  }

  viewTransitionPropertyPopup() {
    if (!this.currentTransition) return;

    const transition = this.currentTransition;
    this.emit("showTransitionPropertyPopup", {
      changeEvent: 'changeTransitionPropertyPopup',
      data: transition.toCloneObject(),
      instance: this  
    });
  }

  [CLICK("$transitionList .preview")](e) {
    this.viewTransitionPicker(e.$dt);
  }

  getRef(...args) {
    return this.refs[args.join("")];
  }

  [EVENT("changeTransitionPropertyPopup")](data) {

    if (this.currentTransition) {

      this.currentTransition.reset({ ...data });

      if (this.current) {

        this.current.reset({
          transition: Transition.replace(this.current.transition, this.selectedIndex, this.currentTransition)
        })

        this.emit("refreshElement", this.current);        
        this.refresh();
      }
    }
  }
}
