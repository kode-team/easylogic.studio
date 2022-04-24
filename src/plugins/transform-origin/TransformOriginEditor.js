import { CLICK, LOAD, SUBSCRIBE_SELF } from "sapa";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

import "./TransformOriginEditor.scss";
import { createComponent } from "sapa";

const typeList = [
  { key: "transform-origin-x", title: "X" },
  { key: "transform-origin-y", title: "Y" },
  { key: "transform-origin-z", title: "Z" },
];

const keyList = typeList.map((it) => it.key);

const origin = {
  top: "50% 0%",
  "top left": "0% 0%",
  "top right": "100% 0%",
  left: "0% 50%",
  center: "50% 50%",
  right: "100% 50%",
  bottom: "50% 100%",
  "bottom left": "0% 100%",
  "bottom right": "100% 100%",
};

export default class TransformOriginEditor extends EditorElement {
  initState() {
    var arr = this.props.value.split(" ");

    var obj = {
      isAll: false,
      "transform-origin": Length.percent(50),
      "transform-origin-x": Length.percent(50),
      "transform-origin-y": Length.percent(50),
    };

    if (this.props.value) {
      if (arr.length === 1) {
        obj["isAll"] = true;
        obj["transform-origin"] = Length.parse(arr[0]);
        obj["transform-origin-x"] = Length.parse(arr[0]);
        obj["transform-origin-y"] = Length.parse(arr[0]);
      } else if (arr.length == 2) {
        obj["isAll"] = false;
        obj["transform-origin-x"] = Length.parse(arr[0]);
        obj["transform-origin-y"] = Length.parse(arr[1]);
      }
    }

    return obj;
  }

  template() {
    return /*html*/ `
      <div class='elf--transform-origin-editor'>
        <div class='direction' ref='$direction'>
          <div class='pos' data-value='top left'></div>        
          <div class='pos' data-value='top'></div>
          <div class='pos' data-value='top right'></div>
          <div class='pos' data-value='left'></div>
          <div class='pos' data-value='center'></div>
          <div class='pos' data-value='right'></div>
          <div class='pos' data-value='bottom left'></div>                   
          <div class='pos' data-value='bottom'></div>
          <div class='pos' data-value='bottom right'></div>
        </div>
        <div ref='$body'></div>
      </div>
    `;
  }

  [CLICK("$direction .pos")](e) {
    var direct = e.$dt.attr("data-value");

    this.state.isAll = false;
    var [x, y] = origin[direct].split(" ");
    this.state["transform-origin-x"] = Length.parse(x);
    this.state["transform-origin-y"] = Length.parse(y);
    this.refresh();
    this.modifyTransformOrigin();
  }

  [SUBSCRIBE_SELF("changeTransformOrigin")](key, value) {
    if (key === "transform-origin") {
      keyList.forEach((type) => {
        this.children[`$${type}`].setValue(value.toString());
      });
    }

    if (key === "transform-origin-z") {
      this.state[key] = value;
    }

    this.setTransformOrigin();
  }

  [LOAD("$body")]() {
    return /*html*/ `
      <div class="full transform-origin-item" ref="$partitialSetting" >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList
            .map((it) => {
              return /*html*/ `
              <div>
                  ${createComponent("RangeEditor", {
                    ref: `$${it.key}`,
                    compact: true,
                    label: it.title,
                    key: it.key,
                    value: this.state[it.key],
                    onchange: "changeTransformOrigin",
                  })}
              </div>  
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  setTransformOrigin() {
    var type = this.refs.$selector.attr("data-selected-value");

    if (type === "all") {
      this.state.isAll = true;
      this.state["transform-origin"] = this.children[`$all`].getValue();
    } else {
      this.state.isAll = false;
      keyList.forEach((key) => {
        this.state[key] = this.children[`$${key}`].getValue();
      });
    }

    this.modifyTransformOrigin();
  }

  modifyTransformOrigin() {
    var value = `${this.state["transform-origin-x"]} ${
      this.state["transform-origin-y"]
    } ${this.state["transform-origin-z"] || "0px"}`;

    this.parent.trigger(this.props.onchange, this.props.key, value);
  }

  [CLICK("$selector button")](e) {
    var type = e.$dt.attr("data-value");
    this.refs.$selector.attr("data-selected-value", type);

    if (type === "all") {
      this.refs.$partitialSetting.hide();
    } else {
      this.refs.$partitialSetting.show("grid");
    }

    this.setTransformOrigin();
  }
}
