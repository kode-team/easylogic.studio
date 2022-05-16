import {
  CLICK,
  SUBSCRIBE,
  CONFIG,
  LOAD,
  DOMDIFF,
  createComponent,
  classnames,
} from "sapa";

import "./PageTools.scss";

import { PathParser } from "elf/core/parser/PathParser";
import { iconUse } from "elf/editor/icon/icon";
import { UPDATE_VIEWPORT } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class PageTools extends EditorElement {
  template() {
    return /*html*/ `     
      <div class='elf--page-tools'>
        <button type='button' ref='$minus'>${iconUse("remove2")}</button>
        <div class='select'>
          ${createComponent("NumberInputEditor", {
            ref: "$scaleInput",
            min: 10,
            max: 240,
            step: 1,
            key: "scale",
            value: this.$viewport.scale * 100,
            onchange: this.subscribe((key, scale) => {
              this.$viewport.setScale(scale / 100);
              this.emit(UPDATE_VIEWPORT);
              this.trigger(UPDATE_VIEWPORT);
            }, 1000),
          })}
        </div>
        <label>%</label>
        <button type='button' ref='$plus'>${iconUse("add")}</button>        
        <button type='button' ref='$center' data-tooltip="Move to Center" data-direction="top">${iconUse(
          "gps_fixed"
        )}</button>    
        <button type='button' ref='$ruler' data-tooltip="Toggle Ruler" data-direction="top">${iconUse(
          "straighten"
        )}</button>    
        <button type='button' ref='$fullscreen' data-tooltip="FullScreen Canvas" data-direction="top">${iconUse(
          "fullscreen"
        )}</button>                        
        <button type='button' ref='$pantool' class="${classnames({
          on: this.$config.get("set.tool.hand"),
        })}" data-tooltip="Hand | H" data-direction="top">${iconUse(
      "pantool"
    )}</button>   
        <!--span class="divider">|</span>
        <button type="button" ref="$selectedCount" style="color:var(--elf--selected-color);font-weight: bold;text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.1)"></button-->
        <!--span ref="$buttons"></span-->
        ${this.$injectManager.generate(
          "page.tools"
        )}                             
      </div>

    `;
  }

  [SUBSCRIBE(UPDATE_VIEWPORT)]() {
    const scale = Math.floor(this.$viewport.scale * 100);

    if (this.children.$scaleInput) {
      this.children.$scaleInput.setValue(scale);
    }
  }

  [CLICK("$plus")]() {
    const oldScale = this.$viewport.scale;
    this.$viewport.setScale(oldScale + 0.01);
    this.emit(UPDATE_VIEWPORT);
    this.trigger(UPDATE_VIEWPORT);
  }

  [CLICK("$minus")]() {
    const oldScale = this.$viewport.scale;
    this.$viewport.setScale(oldScale - 0.01);
    this.emit(UPDATE_VIEWPORT);
    this.trigger(UPDATE_VIEWPORT);
  }

  [CLICK("$center")]() {
    this.$commands.emit("moveSelectionToCenter");
  }

  [CLICK("$pantool")]() {
    this.$config.toggle("set.tool.hand");
  }

  [CLICK("$ruler")]() {
    this.$config.toggle("show.ruler");
  }

  [CLICK("$fullscreen")]() {
    this.emit("bodypanel.toggle.fullscreen");
  }

  [CLICK("$buttons button")](e) {
    const itemId = e.$dt.data("item-id");
    const pathIndex = e.$dt.data("path-index");

    const current = this.$editor.get(itemId);

    if (current.editablePath) {
      this.$commands.emit("open.editor", current);
    } else {
      const pathList = PathParser.fromSVGString(
        current.absolutePath().d
      ).toPathList();

      this.emit("showPathEditor", "modify", {
        box: "canvas",
        current,
        matrix: current.matrix,
        d: pathList[pathIndex].d,
        changeEvent: (data) => {
          pathList[pathIndex].reset(data.d);

          const newPathD = current.invertPath(
            PathParser.joinPathList(pathList).d
          ).d;

          this.$commands.executeCommand("setAttribute", "modify sub path", {
            [itemId]: current.updatePath(newPathD),
          });
        },
      });
    }

    this.emit("hideSelectionToolView");
  }

  [CONFIG("set.tool.hand")]() {
    this.refs.$pantool.toggleClass("on", this.$config.get("set.tool.hand"));
  }

  [LOAD("$buttons") + DOMDIFF]() {
    return "";
    // if (this.$context.selection.isEmpty) return "";

    // const buttons = [];

    // this.$context.selection.items.forEach((selectedItem) => {
    //   selectedItem.allLayers.forEach((item) => {
    //     if (item.isNot("boolean-path")) {
    //       const list = PathParser.fromSVGString(
    //         item.absolutePath().d
    //       ).toPathList();

    //       list.forEach((path, index) => {
    //         buttons.push({
    //           item,
    //           index,
    //           path,
    //         });
    //       });
    //     }
    //   });
    // });

    // return buttons.map((it) => {
    //   const { item, index, path } = it;
    //   return /*html*/ `
    //     <button type="button" data-item-id="${
    //       item.id
    //     }" data-path-index="${index}">
    //       <svg width="16" height="16" overflow="visible">
    //         <path d="${path.scaleWith(16, 16).d}" style="fill:${
    //     item.fill
    //   };stroke:currentColor" stroke-width="1" />
    //       </svg>
    //     </button>
    //   `;
    // });
  }
}
