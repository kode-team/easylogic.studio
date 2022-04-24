import { CLICK, BIND, SUBSCRIBE } from "sapa";
import { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import "./PathManager.scss";

const MODES = {
  "segment-move": "modify",
  modify: "modify",
  path: "path",
  transform: "transform",
  warp: "warp",
};

export default class PathManager extends EditorElement {
  initState() {
    return {
      mode: "move",
      fill: null,
      stroke: null,
      "fill-opacity": null,
      "stroke-width": null,
      msg: this.$i18n("path.manager.msg"),
    };
  }

  template() {
    return /*html*/ `
      <div class='elf--path-manager'>
        <div class="tools left" ref="$left">
            <button type="button" class="primary" data-value='PathEditorDone' title='${this.$i18n(
              "path.manager.mode.modify"
            )}' >Done</button>
        </div>
        <div class='tools' ref='$mode' data-selected-value='${this.state.mode}'>
            <button type="button" data-value='modify' data-tooltip='${this.$i18n(
              "path.manager.mode.modify"
            )}' > ${iconUse("device_hub")}</button>
            <button type="button" data-value='path' data-tooltip='${this.$i18n(
              "path.manager.mode.path"
            )}' > ${iconUse("control_point")}</button>
            <button type="button" data-value='transform' data-tooltip='${this.$i18n(
              "path.manager.mode.transform"
            )}' > ${iconUse("transform")}</button>             
        </div>
        <div class="split"></div>        
        <div class='tools' ref='$util'>
            <button type="button" data-value='reverse' data-tooltip='${this.$i18n(
              "path.manager.mode.reverse"
            )}' >${iconUse("sync")}</button>
        </div>                        
        <div class='tools' ref='$flip'>
            <button type="button" data-value='flipX' data-tooltip='${this.$i18n(
              "path.manager.mode.flipX"
            )}'>${iconUse("flip")}</button>
            <button type="button" data-value='flipY' data-tooltip='${this.$i18n(
              "path.manager.mode.flipY"
            )}'>${iconUse("flip", "rotate(90 12 12)")}</button>
            <button type="button" data-value='flip' data-tooltip='${this.$i18n(
              "path.manager.mode.flipOrigin"
            )}'>${iconUse("flip", "rotate(45 12 12)")}</button>
            <div class="split"></div>            
            <button type="button" data-value='2x' data-tooltip="divide segment by 2 times">2x</button>
            <button type="button" data-value='3x' data-tooltip="divide segment by 3 times">3x</button>            
        </div>
        <div class="subpath" style="display:none">
          <button type="button" data-value="path" data-pathtype="rect">${iconUse(
            "rect",
            "",
            { width: 24, height: 24 }
          )}</button>
        </div>
      </div>    
    `;
  }

  [BIND("$mode")]() {
    return {
      "data-selected-value": MODES[this.state.mode],
    };
  }

  refresh() {
    this.bindData("$mode");
  }

  [CLICK("$flip button")](e) {
    var transformType = e.$dt.attr("data-value");

    if (transformType === "2x") {
      this.emit("divideSegmentsByCount", 2);
    } else if (transformType === "3x") {
      this.emit("divideSegmentsByCount", 3);
    } else {
      this.emit("changePathTransform", transformType);
    }
  }

  [CLICK("$util button")](e) {
    var utilType = e.$dt.attr("data-value");

    this.emit("changePathUtil", utilType);
  }

  [CLICK("$mode button")](e) {
    var mode = e.$dt.attr("data-value");

    this.updateData({
      mode,
    });

    this.refresh();
  }

  [CLICK("$left button")](e) {
    var message = e.$dt.attr("data-value");

    this.emit(message);
  }

  updateData(obj = {}) {
    this.setState(obj, false);
    this.emit(this.state.changeEvent, obj);
  }

  [SUBSCRIBE("changePathManager")](mode) {
    this.setState({ mode });
  }

  [SUBSCRIBE("showPathManager")](obj = {}) {
    obj.changeEvent = obj.changeEvent || "changePathManager";
    this.setState(obj);
    this.$el.show();

    this.emit("addStatusBarMessage", this.state.msg);
  }

  [SUBSCRIBE("hidePathManager")]() {
    this.$el.hide();
  }
}
