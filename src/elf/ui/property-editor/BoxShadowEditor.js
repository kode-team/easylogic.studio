import {
  CLICK,
  DRAGOVER,
  DRAGSTART,
  DROP,
  LOAD,
  PREVENT,
  SUBSCRIBE,
  createComponent,
  DOMDIFF,
} from "sapa";

import "./BoxShadowEditor.scss";

import { iconUse } from "elf/editor/icon/icon";
import { BoxShadow } from "elf/editor/property-parser/BoxShadow";
import { BoxShadowStyle } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class BoxShadowEditor extends EditorElement {
  initState() {
    return {
      boxShadows: BoxShadow.parseStyle(this.props.value || ""),
    };
  }

  template() {
    return /*html*/ `
      <div class="elf--box-shadow-editor" >
        <div class='box-shadow-list' ref='$shadowList'></div>
      </div>
    `;
  }

  [LOAD("$shadowList") + DOMDIFF]() {
    var arr = this.state.boxShadows.map((shadow, index) => {
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
            ${createComponent("ToggleButton", {
              mini: true,
              key: "inset",
              value: shadow.inset,
              params: index,
              onChange: "changeKeyValue",
              checkedValue: BoxShadowStyle.INSET,
              toggleLabels: [iconUse("border_style"), iconUse("border_style")],
              toggleTitles: [BoxShadowStyle.INSET, BoxShadowStyle.INSET],
              toggleValues: [BoxShadowStyle.OUTSET, BoxShadowStyle.INSET],
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
            ${createComponent("NumberInputEditor", {
              mini: true,
              label: "S",
              key: "spreadRadius",
              value: shadow.spreadRadius,
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

  modifyBoxShadow() {
    var value = this.state.boxShadows.join(", ");

    this.parent.trigger(this.props.onchange, this.props.key, value);
  }

  [SUBSCRIBE("add")](shadow = "") {
    if (shadow) {
      this.state.boxShadows = BoxShadow.parseStyle(shadow);
    } else {
      const shadowObj = new BoxShadow({
        color: "black",
        inset: BoxShadowStyle.OUTSET,
        offsetX: 2,
        offsetY: 2,
        blurRadius: 3,
        spreadRadius: 1,
      });

      this.state.boxShadows.push(shadowObj);
    }

    this.refresh();

    this.modifyBoxShadow();
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

  sortBoxShadow(startIndex, targetIndex) {
    this.sortItem(this.state.boxShadows, startIndex, targetIndex);
  }

  [DROP("$shadowList .shadow-item") + PREVENT](e) {
    var targetIndex = +e.$dt.attr("data-index");

    this.sortBoxShadow(this.startIndex, targetIndex);

    this.refresh();

    this.modifyBoxShadow();
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$dt.attr("data-index");

    this.state.boxShadows.splice(index, 1);

    this.refresh();

    this.modifyBoxShadow();
  }

  [SUBSCRIBE("changeKeyValue")](key, value, index) {
    var shadow = this.state.boxShadows[index];

    shadow.reset({
      [key]: value,
    });

    this.modifyBoxShadow();
  }
}
