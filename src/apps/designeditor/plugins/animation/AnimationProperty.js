import { clone, LOAD, CLICK, DOMDIFF, SUBSCRIBE } from "sapa";

import "./AnimationProperty.scss";

import { curveToPath } from "elf/core/func";
import { iconUse } from "elf/editor/icon/icon";
// import { Animation } from "elf/editor/property-parser/Animation";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";
import { Length } from "elf/editor/unit/Length";

export default class AnimationProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("title");
  }
  getBody() {
    return /*html*/ `<div class='elf--animation-list' ref='$animationList'></div>`;
  }

  getTools() {
    return /*html*/ `
        <button type="button" ref="$add" title="add Fill">${iconUse(
          "add"
        )}</button>
    `;
  }

  isFirstShow() {
    return true;
  }

  get localeKey() {
    return "animation.property";
  }

  [LOAD("$animationList") + DOMDIFF]() {
    var current = this.$context.selection.current;

    if (!current) return "";

    return current.animation.map((it, index) => {
      const selectedClass =
        this.state.selectedIndex === index ? "selected" : "";
      const path = curveToPath(it.timingFunction, 30, 30);

      return /*html*/ `
      <div class='animation-group-item'>
        <div class='animation-item ${selectedClass}' 
             data-index='${index}' 
             ref="animationIndex${index}" 
          >
            <div class='timing preview' data-index='${index}' ref='$preview${index}'>
              <svg class='item-canvas' width="30" height="30" viewBox="0 0 30 30">
                <path d="${path}" stroke="white" stroke-width="1" fill='none' />
              </svg>
            </div>
            <div class='name'>
              <div class='title' ref="animationName${index}">
                ${
                  it.name
                    ? it.name
                    : `&lt; ${this.$i18n("select a keyframe")} &gt;`
                }
              </div>
              <div class='labels'>
                <label class='count' title='${this.$i18n(
                  "iteration.count"
                )}'><small>${it.iterationCount}</small></label>
                <label class='delay' title='${this.$i18n("delay")}'>
                  <small>${it.delay}</small>
                </label>
                <label class='duration' title='${this.$i18n(
                  "duration"
                )}'><small>${it.duration}</small></label>
                <label class='direction' title='${this.$i18n(
                  "direction"
                )}'><small>${it.direction}</small></label>
                <label class='fill-mode' title='${this.$i18n(
                  "fill.mode"
                )}'><small>${it.fillMode}</small></label>
                <label 
                  class='play-state' 
                  title='${this.$i18n("play.state")}' 
                  data-index='${index}' 
                  data-play-state-selected-value="${it.playState}">
                  <small data-play-state-value='running'>${iconUse(
                    "play"
                  )}</small>
                  <small data-play-state-value='paused'>${iconUse(
                    "pause"
                  )}</small>
                </label>
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
      const animation = current.animation || [];

      animation.push({
        itemType: "animation",
        checked: true,
        name: "none",
        direction: "normal",
        duration: Length.second(0),
        timingFunction: "linear",
        delay: Length.second(0),
        iterationCount: Length.string("infinite"),
        playState: "running",
        fillMode: "none",
      });

      this.$commands.executeCommand(
        "setAttribute",
        "add animation property",
        this.$context.selection.packByValue({
          animation: [...animation],
        })
      );

      this.nextTick(() => {
        this.refresh();
      }, 100);
    } else {
      window.alert("Select a layer");
    }
  }

  [CLICK("$animationList .tools .del")](e) {
    var removeIndex = e.$dt.attr("data-index");
    var current = this.$context.selection.current;
    if (!current) return;

    const animation = current.animation || [];

    animation.splice(removeIndex, 1);

    this.$commands.executeCommand(
      "setAttribute",
      "remove animation property",
      this.$context.selection.packByValue({
        animation: [...animation],
      })
    );

    this.refresh();
  }

  [CLICK("$animationList .play-state")](e) {
    var index = +e.$dt.attr("data-index");
    var current = this.$context.selection.current;
    if (!current) return;

    const animation = current.animation || [];

    var currentAnimation = animation[index];
    if (currentAnimation) {
      currentAnimation.playState =
        currentAnimation.playState === "running" ? "paused" : "running";

      e.$dt.attr("data-play-state-selected-value", currentAnimation.playState);

      this.$commands.executeCommand(
        "setAttribute",
        "remove animation property",
        this.$context.selection.packByValue({
          animation: [...animation],
        })
      );
    }
  }

  selectItem(selectedIndex, isSelected = true) {
    if (isSelected) {
      this.refs[`animationIndex${selectedIndex}`].addClass("selected");
    } else {
      this.refs[`animationIndex${selectedIndex}`].removeClass("selected");
    }
  }

  viewAnimationPicker($preview) {
    if (typeof this.selectedIndex === "number") {
      this.selectItem(this.selectedIndex, false);
    }

    this.selectedIndex = +$preview.attr("data-index");
    this.current = this.$context.selection.current;

    if (!this.current) return;

    const animation = this.current.animation || [];

    var currentAnimation = animation[this.selectedIndex];

    this.currentAnimation = clone(currentAnimation);

    this.viewAnimationPropertyPopup();
  }

  viewAnimationPropertyPopup() {
    if (!this.currentAnimation) return;

    const animation = this.currentAnimation;
    this.emit("showAnimationPropertyPopup", {
      changeEvent: "changeAnimationPropertyPopup",
      data: clone(animation),
      instance: this,
    });
  }

  [CLICK("$animationList .preview")](e) {
    this.viewAnimationPicker(e.$dt);
  }

  [SUBSCRIBE("changeAnimationPropertyPopup")](data) {
    if (this.currentAnimation) {
      const animation = this.current.animation;
      animation[this.selectedIndex] = data;

      if (this.current) {
        this.$commands.executeCommand(
          "setAttribute",
          "change animation property",
          this.$context.selection.packByValue({
            animation: [...animation],
          })
        );

        this.refresh();
      }
    }
  }
}
