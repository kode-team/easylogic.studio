import {
  CLICK,
  DRAGOVER,
  DRAGSTART,
  DROP,
  LOAD,
  PREVENT,
  SUBSCRIBE,
  createComponent,
  SUBSCRIBE_SELF,
} from "sapa";

import "./TextShadowEditor.scss";

import { iconUse } from "elf/editor/icon/icon";
import { TextShadow } from "elf/editor/property-parser/TextShadow";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class TextShadowEditor extends EditorElement {
  initState() {
    return {
      textShadows: TextShadow.parseStyle(this.props.value),
    };
  }

  template() {
    return /*html*/ `
      <div class="elf--text-shadow-editor" >
        <div class='text-shadow-list' ref='$shadowList'></div>
      </div>
    `;
  }

  [LOAD("$shadowList")]() {
    var arr = this.state.textShadows.map((shadow, index) => {
      return /*html*/ `
        <div class="shadow-item real" data-index="${index}">
          <label draggable="true" data-index="${index}">${iconUse(
        "drag_indicator"
      )}</label>
          ${createComponent("ColorViewEditor", {
            mini: true,
            key: "color",
            value: shadow.color,
            params: index,
            onchange: "changeKeyValue",
          })}
          ${createComponent("NumberInputEditor", {
            mini: true,
            key: "offsetX",
            label: "X",
            value: shadow.offsetX,
            params: index,
            onchange: "changeKeyValue",
          })}          
          ${createComponent("NumberInputEditor", {
            mini: true,
            key: "offsetY",
            label: "Y",
            value: shadow.offsetY,
            params: index,
            onchange: "changeKeyValue",
          })}                    
          ${createComponent("NumberInputEditor", {
            mini: true,
            label: "B",
            key: "blurRadius",
            value: shadow.blurRadius,
            params: index,
            onchange: "changeKeyValue",
          })}                    
          <div class="tools">
            <button type="button" class="remove" data-index="${index}">
              ${iconUse("remove2")}
            </button>
          </div>
        </div>
      `;
    });

    return arr.join("");
  }

  modifyTextShadow() {
    var value = this.state.textShadows.join(", ");

    this.parent.trigger(this.props.onchange, this.props.key, value);
  }

  [SUBSCRIBE("add")](shadow = "") {
    if (shadow) {
      this.state.textShadows = TextShadow.parseStyle(shadow);
    } else {
      this.state.textShadows.push(new TextShadow());
    }

    this.refresh();

    this.modifyTextShadow();
  }

  [CLICK("$add")]() {
    this.trigger("add");
  }

  [DRAGSTART("$shadowList .shadow-item > label")](e) {
    this.startIndex = +e.$dt.attr("data-index");
  }

  [DRAGOVER("$shadowList .shadow-item") + PREVENT]() {}

  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortTextShadow(startIndex, targetIndex) {
    this.sortItem(this.state.textShadows, startIndex, targetIndex);
  }

  [DROP("$shadowList .shadow-item") + PREVENT](e) {
    var targetIndex = +e.$dt.attr("data-index");

    this.sortTextShadow(this.startIndex, targetIndex);

    this.refresh();

    this.modifyTextShadow();
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$dt.attr("data-index");

    this.state.textShadows.splice(index, 1);

    this.refresh();

    this.modifyTextShadow();
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value, index) {
    var shadow = this.state.textShadows[index];

    shadow.reset({
      [key]: value,
    });

    // this.refresh();

    this.modifyTextShadow();
  }
}
