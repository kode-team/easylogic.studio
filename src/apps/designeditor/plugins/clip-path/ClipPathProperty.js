import { CLICK, LOAD, PREVENT, SUBSCRIBE, IF, createComponent } from "sapa";

import "./ClipPathProperty.scss";

import { vertiesToRectangle } from "elf/core/collision";
import { PathParser } from "elf/core/parser/PathParser";
import icon, { iconUse } from "elf/editor/icon/icon";
import polygon from "elf/editor/preset/clip-path/polygon";
import { ClipPath } from "elf/editor/property-parser/ClipPath";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { ClipPathType } from "elf/editor/types/model";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

const ClipPathSample = {
  [ClipPathType.CIRCLE]: "circle(50% at 50% 50%)",
  [ClipPathType.ELLIPSE]: "ellipse(50% 50% at 50% 50%)",
  [ClipPathType.INSET]: "inset(0% 0% 0% 0%)",
  [ClipPathType.POLYGON]: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  [ClipPathType.PATH]: "path()",
};

export default class ClipPathProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("clippath.property.title");
  }

  getClassName() {
    return "clip-path-property";
  }

  getBody() {
    return /*html*/ `<div class='elf--clip-path-list' ref='$clippathList'></div>`;
  }

  getTools() {
    return /*html*/ `
      <div ref="$tools" class="add-tools">
        <button type="button" data-value='circle' data-tooltip="Circle">${iconUse(
          "outline_circle"
        )}</button>
        <button type="button" data-value='ellipse' data-tooltip="Ellipse">${iconUse(
          "outline_circle",
          "scale(1 0.7) translate(0 5)"
        )}</button>
        <button type="button" data-value='inset' data-tooltip="Inset">${iconUse(
          "outline_rect"
        )}</button>
        <button type="button" data-value='polygon' data-tooltip="Polygon">${iconUse(
          "polygon"
        )}</button>
        <button type="button" data-value='path' data-tooltip="Path">${iconUse(
          "pentool"
        )}</button>
        <button type="button" data-value='svg' data-tooltip="SVG">${iconUse(
          "image"
        )}</button>
      </div>
    `;
  }

  makeClipPathTemplate(clippath, func) {
    const isPath = clippath === "path";
    const isPolygon = clippath === "polygon";

    let newPathString = "";
    if (isPath) {
      const pathString = func.split("(")[1].split(")")[0];

      let pathObject = PathParser.fromSVGString(pathString);
      const bbox = pathObject.getBBox();
      const rectangle = vertiesToRectangle(bbox);

      const rate = 260 / rectangle.width;
      const hRate = 150 / rectangle.height;

      const lastRate = Math.min(rate, hRate);

      pathObject = pathObject
        .translate(-bbox[0][0], -bbox[0][1])
        .scale(lastRate, lastRate);

      const newBBox = pathObject.getBBox();
      const newRectangle = vertiesToRectangle(newBBox);

      newPathString = pathObject.translate(
        260 / 2 - newRectangle.width / 2,
        0
      ).d;
    }

    let polygonSelect = "";
    if (isPolygon) {
      const polygonList = polygon.execute();

      polygonSelect = createComponent("SelectEditor", {
        ref: "$polygonSelect",
        options: ["", ...polygonList.map((it) => it.name)],
        onchange: (key, value) => {
          const polygon = polygonList.find((it) => it.name === value);

          if (polygon) {
            this.updatePathInfo({
              "clip-path": `polygon(${polygon.polygon})`,
            });
          }
        },
      });
    }

    return /*html*/ `
      <div>
        <div class='clippath-item'>
          <label>${iconUse("drag_indicator")}</label>
          <div class='title'>
            <div class='name'>${clippath}</div>
            ${isPolygon ? polygonSelect : ""}
          </div>
          <div class='tools'>
            <button type="button" class="del">${icon.remove2}</button>
          </div>        
        </div>
        ${
          isPath
            ? `<svg><path d="${newPathString}" fill="transparent" stroke="currentColor" /></svg>`
            : ""
        }
      </div>

    `;
  }

  [CLICK("$clippathList .clippath-item .title .name")]() {
    var current = this.$context.selection.current;
    if (!current) return;

    this.viewClipPathPicker();
  }

  [CLICK("$clippathList .del") + PREVENT]() {
    var current = this.$context.selection.current;
    if (!current) return;

    this.$commands.executeCommand(
      "setAttribute",
      "delete clip-path",
      this.$context.selection.packByValue({
        clipPath: "",
      })
    );
    this.emit("hideClipPathPopup");

    window.setTimeout(() => {
      this.refresh();
    }, 100);
  }

  get editableProperty() {
    return "clipPath";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow")]() {
    this.refresh();
  }

  [LOAD("$clippathList")]() {
    var current = this.$context.selection.current;
    if (!current) return "";
    if (!current.clipPath) return "";

    return this.makeClipPathTemplate(
      current.clipPath.split("(")[0],
      current.clipPath
    );
  }

  [CLICK("$tools [data-value]")](e) {
    var current = this.$context.selection.current;

    if (!current) return;
    if (current.clipPath) {
      window.alert("clip-path is already exists.");
      return;
    }

    if (current) {
      current.reset({
        clipPath: ClipPathSample[e.$dt.data("value")],
      });

      this.$commands.executeCommand(
        "setAttribute",
        "change clipPath",
        this.$context.selection.pack("clipPath")
      );
    }

    this.refresh();
  }

  viewClipPathPicker() {
    var current = this.$context.selection.current;
    if (!current) return;

    var obj = ClipPath.parseStyle(current.clipPath);

    switch (obj.type) {
      case "path":
        var d = current.absolutePath(current.clipPathString).d;
        var mode = d ? "modify" : "path";

        this.emit("showPathEditor", mode, {
          changeEvent: (data) => {
            data.d = current.invertPath(data.d).d;

            this.updatePathInfo({
              clipPath: `path(${data.d})`,
            });
          },
          current,
          d,
        });
        break;
      case "svg":
        // TODO: clip art 선택하기
        break;
    }
  }

  updatePathInfo(data) {
    if (!data) return;
    var current = this.$context.selection.current;
    if (!current) return;

    current.reset(data);

    this.refresh();
    this.$commands.executeCommand(
      "setAttribute",
      "change clipPath",
      this.$context.selection.packByValue(data)
    );
  }
}
