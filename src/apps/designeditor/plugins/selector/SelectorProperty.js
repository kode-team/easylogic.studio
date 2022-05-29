import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT,
  DEBOUNCE,
  STOP,
  SUBSCRIBE,
  createComponent,
} from "sapa";

import "./SelectorProperty.scss";

import icon from "elf/editor/icon/icon";
import { Selector } from "elf/editor/property-parser/Selector";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

const selectorList = [
  "", // custom
  ":hover",
  ":active",
  ":before",
  ":after",
  ":first-child",
  ":last-child",
  ":link",
  ":active",
  ":focus",
].map((value) => ({ value }));

/**
 * 객체별 class, selector 를 줄 수 있는 개념을 다시 만들자.
 */
export default class SelectorProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("selector.property.title");
  }
  getBody() {
    return /*html*/ `<div class='elf--selector-list' ref='$selectorList'></div>`;
  }

  getTools() {
    return /*html*/ `
      <div style='display:inline-block;'>
        ${createComponent("SelectEditor", {
          ref: "$select",
          key: "selector",
          "none-value": "selector",
          options: selectorList,
        })}
      </div>
      <button type="button" ref="$add" title="add Selector">${icon.add}</button>
    `;
  }

  makeSelectorTemplate(selector, index) {
    index = index.toString();
    return /*html*/ `
      <div class='selector-item' draggable='true' ref='$selectorIndex${index}' data-index='${index}'>
        <div class='title'>
          <div class='name'>
            <span>${
              selector.selector ||
              `&lt;${this.$i18n("selector.property.none")}&gt;`
            }</span>
          </div>
          <div class='tools'>
              <button type="button" class="del" data-index="${index}">${
      icon.remove2
    }</button>
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$selectorList .selector-item .name")](e) {
    var index = +e.$dt.closest("selector-item").attr("data-index");

    var current = this.$context.selection.current;
    if (!current) return;

    this.viewSelectorPicker(index);
  }

  [CLICK("$selectorList .selector-item .del") + PREVENT + STOP](e) {
    var removeIndex = e.$dt.attr("data-index");
    var current = this.$context.selection.current;
    if (!current) return;

    const selectors = current.selectors || [];

    selectors.splice(removeIndex, 1);

    this.$commands.executeCommand(
      "setAttribute",
      "change selectors",
      this.$context.selection.packByValue({
        selectors,
      })
    );

    this.refresh();
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100)]() {
    this.refreshShowIsNot([
      "project",
      "svg-path",
      "svg-brush",
      "svg-textpath",
      "svg-text",
    ]);
  }

  [LOAD("$selectorList")]() {
    var current = this.$context.selection.current;

    if (!current) return "";

    var selectors = current.selectors || [];

    return selectors.map((selector, index) => {
      return this.makeSelectorTemplate(selector, index);
    });
  }

  // selector-item 을 통째로  dragstart 를 걸어버리니깐
  // 다른 ui 를 핸들링 할 수가 없어서
  // title  에만 dragstart 거는 걸로 ok ?
  [DRAGSTART("$selectorList .selector-item .title")](e) {
    this.startIndex = +e.$dt.attr("data-index");
  }

  // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
  [DRAGOVER("$selectorList .selector-item") + PREVENT]() {}

  [DROP("$selectorList .selector-item") + PREVENT](e) {
    var targetIndex = +e.$dt.attr("data-index");
    var current = this.$context.selection.current;
    if (!current) return;

    current.sortSelector(this.startIndex, targetIndex);

    this.$commands.executeCommand(
      "setAttribute",
      "change selectors",
      this.$context.selection.packByValue({
        selectors: [...current.selectors],
      })
    );

    this.refresh();
  }

  [CLICK("$add")]() {
    var current = this.$context.selection.current;
    if (current) {
      current.createSelector({
        selector: this.children.$select.getValue(),
      });

      this.$commands.executeCommand(
        "setAttribute",
        "change selectors",
        this.$context.selection.packByValue({
          selectors: [...current.selectors],
        })
      );
    }

    this.refresh();
  }

  viewSelectorPicker(index) {
    if (typeof this.selectedIndex === "number") {
      this.selectItem(this.selectedIndex, false);
    }

    this.selectedIndex = +index;
    this.selectItem(this.selectedIndex, true);
    this.current = this.$context.selection.current;

    if (!this.current) return;
    this.currentSelector = this.current.selectors[this.selectedIndex];

    this.viewSelectorPropertyPopup();
  }

  // 객체를 선택하는 괜찮은 패턴이 어딘가에 있을 텐데......
  // 언제까지 selected 를 설정해야하는가?
  selectItem(selectedIndex, isSelected = true) {
    if (isSelected) {
      this.getRef("$selectorIndex", selectedIndex).addClass("selected");
    } else {
      this.getRef("$selectorIndex", selectedIndex).removeClass("selected");
    }

    if (this.current) {
      this.current.selectors.forEach((it, index) => {
        it.selected = index === selectedIndex;
      });
    }
  }

  viewSelectorPropertyPopup(position) {
    this.current = this.$context.selection.current;

    if (!this.current) return;
    this.currentSelector = this.current.selectors[this.selectedIndex];

    const back = this.currentSelector;

    const selector = back.selector;
    const properties = back.properties;

    this.emit("showSelectorPopup", {
      position,
      selector,
      properties,
    });
  }

  [SUBSCRIBE("changeSelectorPopup")](data) {
    this.current = this.$context.selection.current;

    if (!this.current) return;

    this.current.selectors[this.selectedIndex] = data;

    this.$commands.executeCommand(
      "setAttribute",
      "change selectors",
      this.$context.selection.pack({
        selectors: [...this.current.selectors],
      })
    );

    this.nextTick(() => {
      this.refresh();
    }, 10);
  }
}
