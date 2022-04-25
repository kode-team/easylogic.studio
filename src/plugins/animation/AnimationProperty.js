import { LOAD, CLICK, DEBOUNCE, DOMDIFF, SUBSCRIBE } from "sapa";

import "./AnimationProperty.scss";

import { curveToPath } from "elf/core/func";
import { iconUse } from "elf/editor/icon/icon";
import { Animation } from "elf/editor/property-parser/Animation";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class AnimationProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("animation.property.title");
  }
  getBody() {
    return /*html*/ `<div class='animation-list' ref='$animationList'></div>`;
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

  [LOAD("$animationList") + DOMDIFF]() {
    var current = this.$selection.current;

    if (!current) return "";

    return Animation.parseStyle(current.animation).map((it, index) => {
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
                    : `&lt; ${this.$i18n(
                        "animation.property.select a keyframe"
                      )} &gt;`
                }
              </div>
              <div class='labels'>
                <label class='count' title='${this.$i18n(
                  "animation.property.iteration.count"
                )}'><small>${it.iterationCount}</small></label>
                <label class='delay' title='${this.$i18n(
                  "animation.property.delay"
                )}'><small>${it.delay}</small></label>
                <label class='duration' title='${this.$i18n(
                  "animation.property.duration"
                )}'><small>${it.duration}</small></label>
                <label class='direction' title='${this.$i18n(
                  "animation.property.direction"
                )}'><small>${it.direction}</small></label>
                <label class='fill-mode' title='${this.$i18n(
                  "animation.property.fill.mode"
                )}'><small>${it.fillMode}</small></label>
                <label class='play-state' title='${this.$i18n(
                  "animation.property.play.state"
                )}' data-index='${index}' data-play-state-selected-value="${
        it.playState
      }">
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

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100)]() {
    const current = this.$selection.current;
    if (current && current.hasChangedField("animation")) {
      this.refresh();
    }
    this.emit("hideAnimationPropertyPopup");
  }

  [CLICK("$add")]() {
    var current = this.$selection.current;

    if (current) {
      this.command(
        "setAttributeForMulti",
        "add animation property",
        this.$selection.packByValue({
          animation: (item) => Animation.add(item.animation, { name: null }),
        })
      );

      this.nextTick(() => {
        window.setTimeout(() => {
          this.refresh();
        }, 100);
      });
    } else {
      window.alert("Select a layer");
    }
  }

  [CLICK("$animationList .tools .del")](e) {
    var removeIndex = e.$dt.attr("data-index");
    var current = this.$selection.current;
    if (!current) return;

    current.reset({
      animation: Animation.remove(current.animation, removeIndex),
    });

    this.emit("refreshElement", current);

    this.refresh();
  }

  [CLICK("$animationList .play-state")](e) {
    var index = +e.$dt.attr("data-index");
    var current = this.$selection.current;
    if (!current) return;

    const list = Animation.parseStyle(current.animation);
    var animation = list[index];
    if (animation) {
      animation.togglePlayState();

      e.$dt.attr("data-play-state-selected-value", animation.playState);

      current.reset({
        animation: Animation.join(list),
      });

      this.emit("refreshElement", current);
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
    this.current = this.$selection.current;

    if (!this.current) return;
    this.currentAnimation = Animation.get(
      this.current.animation,
      this.selectedIndex
    );

    this.viewAnimationPropertyPopup();
  }

  viewAnimationPropertyPopup() {
    if (!this.currentAnimation) return;

    const animation = this.currentAnimation;
    this.emit("showAnimationPropertyPopup", {
      changeEvent: "changeAnimationPropertyPopup",
      data: animation.toCloneObject(),
      instance: this,
    });
  }

  [CLICK("$animationList .preview")](e) {
    this.viewAnimationPicker(e.$dt);
  }

  getRef(...args) {
    return this.refs[args.join("")];
  }

  [SUBSCRIBE("changeAnimationPropertyPopup")](data) {
    if (this.currentAnimation) {
      this.currentAnimation.reset({ ...data });

      if (this.current) {
        this.command(
          "setAttributeForMulti",
          "change animation property",
          this.$selection.packByValue({
            animation: (item) =>
              Animation.replace(
                item.animation,
                this.selectedIndex,
                this.currentAnimation
              ),
          })
        );

        this.refresh();
      }
    }
  }
}
