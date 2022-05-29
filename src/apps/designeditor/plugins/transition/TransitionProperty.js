import { clone, LOAD, CLICK, DOMDIFF, SUBSCRIBE } from "sapa";

import "./TransitionProperty.scss";

import { curveToPath } from "elf/core/func";
import { iconUse } from "elf/editor/icon/icon";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class TransitionProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("transition.property.title");
  }

  getBody() {
    return /*html*/ `<div class='elf--transition-list' ref='$transitionList'></div>`;
  }

  getTools() {
    return /*html*/ `
        <button type="button" ref="$add" title="add Transition">${iconUse(
          "add"
        )}</button>
    `;
  }

  isFirstShow() {
    return true;
  }

  [LOAD("$transitionList") + DOMDIFF]() {
    var current = this.$context.selection.current;

    if (!current) return "";

    return current.transition.map((it, index) => {
      const selectedClass =
        this.state.selectedIndex === index ? "selected" : "";

      const path = curveToPath(it.timingFunction, 30, 30);

      return /*html*/ `
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
                <span class='duration' title='Duration'><small>Duration: ${
                  it.duration
                }</small></span>
                <span class='delay' title='Delay'><small>Delay: ${
                  it.delay
                }</small></span>
              </div>
            </div>
            <div class='tools'>
                <button type="button" class="del" data-index="${index}">
                  ${iconUse("remove2")}
                </button>
            </div>
        </div>
      </div>        
      `;
    });
  }

  [SUBSCRIBE(REFRESH_SELECTION)]() {
    this.refresh();
  }

  [CLICK("$add")]() {
    var current = this.$context.selection.current;

    if (current) {
      const transition = current.transition || [];

      transition.push({
        name: "all",
        duration: "1s",
        timingFunction: "linear",
        delay: "0s",
      });
      this.$commands.executeCommand(
        "setAttribute",
        "add transition",
        this.$context.selection.packByValue({
          transition: [...transition],
        })
      );

      this.nextTick(() => {
        this.refresh();
      }, 10);
    } else {
      window.alert("Select a layer");
    }
  }

  getCurrentTransition() {
    return this.current.transition[this.selectedIndex];
  }

  [CLICK("$transitionList .tools .del")](e) {
    var removeIndex = e.$dt.attr("data-index");
    var current = this.$context.selection.current;
    if (!current) return;

    current.transition.splice(removeIndex, 1);

    this.$commands.executeCommand(
      "setAttribute",
      "add transition",
      this.$context.selection.packByValue({
        transition: [...current.transition],
      })
    );

    this.nextTick(() => {
      this.refresh();
    }, 10);
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
    this.current = this.$context.selection.current;

    if (!this.current) return;
    this.currentTransition = this.current.transition[this.selectedIndex];

    this.viewTransitionPropertyPopup();
  }

  viewTransitionPropertyPopup() {
    if (!this.currentTransition) return;

    const transition = this.currentTransition;
    this.emit("showTransitionPropertyPopup", {
      changeEvent: "changeTransitionPropertyPopup",
      data: clone(transition),
      instance: this,
    });
  }

  [CLICK("$transitionList .preview")](e) {
    this.viewTransitionPicker(e.$dt);
  }

  [SUBSCRIBE("changeTransitionPropertyPopup")](data) {
    if (this.currentTransition) {
      if (this.current) {
        const transition = this.current.transition;
        transition[this.selectedIndex] = data;

        this.$commands.executeCommand(
          "setAttribute",
          "add transition",
          this.$context.selection.packByValue({
            transition: [...transition],
          })
        );

        this.nextTick(() => {
          this.refresh();
        }, 10);
      }
    }
  }
}
