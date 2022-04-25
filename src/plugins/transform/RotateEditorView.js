import { POINTERSTART, DOUBLECLICK, BIND, CLICK, SUBSCRIBE, IF } from "sapa";

import "./RotateEditorView.scss";

import { calculateAnglePointDistance } from "elf/core/math";
import icon from "elf/editor/icon/icon";
import { Transform } from "elf/editor/property-parser/Transform";
import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

const directions = [
  "top-left",
  "top",
  "top-right",
  "left",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
];

const DEFINED_ANGLES = {
  top: "0",
  "top-right": "45",
  right: "90",
  "bottom-right": "135",
  bottom: "180",
  "bottom-left": "225",
  left: "270",
  "top-left": "315",
};

export default class RotateEditorView extends EditorElement {
  template() {
    return /*html*/ `
            <div class='elf--rotate-editor-view'>            
                <div class='rotate-area' ref='$rotateArea'>
                    <div class='rotate-container' ref='$rotateContainer'>
                        <div class='rotate-item rotate-x'></div>
                        <div class='rotate-item rotate-y'></div>
                    </div>
                </div>
                <div class='direction-area' ref='$directionArea'>
                    ${directions
                      .map((it) => {
                        return /*html*/ `<div class='direction' data-value='${it}'></div>`;
                      })
                      .join("")}
                </div>                
                <div class='rotate-z' ref='$rotateZ'>
                    <div class='handle-line'></div>                
                    <div class='handle icon' ref='$handle'>${
                      icon.gps_fixed
                    }</div>
                </div>                
            </div>
        `;
  }

  [CLICK("$directionArea .direction")](e) {
    var direction = e.$dt.attr("data-value");
    var value = Length.deg(DEFINED_ANGLES[direction] || 0);
    this.$selection.each((item) => {
      const transform = Transform.replace(item.transform, {
        type: "rotateZ",
        value: [value],
      });
      item.reset({ transform });
    });

    this.bindData("$rotateZ");
    this.command(
      "setAttributeForMulti",
      "change direction",
      this.$selection.pack("transform")
    );
    // this.emit('refreshSelectionTool', false);
  }

  [BIND("$rotateContainer")]() {
    var current = this.$selection.current || { transform: "" };

    var transform = Transform.filter(current.transform || "", (it) => {
      return it.type === "rotateX" || it.type === "rotateY";
    });

    return {
      style: {
        transform,
      },
    };
  }

  [BIND("$rotateZ")]() {
    var current = this.$selection.current || { transform: "" };

    var transform = Transform.filter(current.transform || "", (it) => {
      return it.type === "rotate" || it.type === "rotateZ";
    });

    return {
      style: {
        transform,
      },
    };
  }

  [DOUBLECLICK("$rotateArea")]() {
    this.$selection.reset(
      this.$selection.packByValue({
        transform: (item) => {
          return Transform.remove(item.transform, ["rotateX", "rotateY"]);
        },
      })
    );
    // this.$selection.reselect();
    this.command(
      "setAttributeForMulti",
      "change direction",
      this.$selection.pack("transform")
    );
    // this.emit('refreshSelectionTool');
    this.bindData("$rotateContainer");
  }

  [POINTERSTART("$rotateArea") +
    MOVE("moveRotateXY") +
    END("moveEndRotateXY")]() {
    this.state.rotateCache = this.$selection.map((item) => {
      const rotateX = Transform.get(item["transform"], "rotateX");
      const rotateY = Transform.get(item["transform"], "rotateY");

      return {
        item,
        rotateX: rotateX ? rotateX[0] : Length.deg(0),
        rotateY: rotateY ? rotateY[0] : Length.deg(0),
      };
    });
  }

  moveRotateXY(dx, dy) {
    var rx = Length.deg(-dy);
    var ry = Length.deg(dx);

    // todo: selection 말고 실제 값이 바뀔 수 있도록 구조화 해야함
    this.state.rotateCache.forEach((cache) => {
      let transform = cache.item.transform;
      transform = Transform.rotateX(
        transform,
        Length.deg(cache.rotateX.value + rx.value)
      );
      transform = Transform.rotateY(
        transform,
        Length.deg(cache.rotateY.value + ry.value)
      );

      cache.item.reset({
        transform,
      });
    });

    this.bindData("$rotateContainer");

    this.command(
      "setAttributeForMulti",
      "change rotate",
      this.$selection.pack("transform")
    );
    // this.emit('refreshSelectionTool');
  }

  moveEndRotateXY() {
    this.command(
      "setAttributeForMulti",
      "change rotate",
      this.$selection.pack("transform")
    );
    // this.emit('refreshSelectionTool');
  }

  [DOUBLECLICK("$handle")]() {
    this.$selection.reset(
      this.$selection.packByValue({
        transform: (item) => {
          return Transform.remove(item.transform, ["rotateZ", "rotate"]);
        },
      })
    );
    // this.$selection.reselect();
    this.bindData("$rotateZ");
    this.command(
      "setAttributeForMulti",
      "change rotate handle",
      this.$selection.pack("transform")
    );
    // this.emit('refreshSelectionTool');
  }

  [POINTERSTART("$handle") + MOVE() + END()]() {
    var pointerRect = this.refs.$handle.rect();
    var targetRect = this.refs.$rotateZ.rect();
    this.rotateZCenter = {
      x: targetRect.x + targetRect.width / 2,
      y: targetRect.y + targetRect.height / 2,
    };
    this.rotateZStart = {
      x: pointerRect.x + pointerRect.width / 2,
      y: pointerRect.y + pointerRect.height / 2,
    };
    this.state.rotateCache = this.$selection.map((item) => {
      const rotateZ = Transform.get(item["transform"], "rotateZ");
      return {
        item,
        rotateZ: rotateZ ? rotateZ[0] : Length.deg(0),
      };
    });
  }

  move(dx, dy) {
    this.modifyRotateZ(dx, dy);

    this.bindData("$rotateZ");
    this.command(
      "setAttributeForMulti",
      "change rotate handle",
      this.$selection.pack("transform")
    );
    // this.emit('refreshSelectionTool');
  }

  end() {
    this.command(
      "setAttributeForMulti",
      "change rotate handle",
      this.$selection.pack("transform")
    );
    // this.emit('refreshSelectionTool');
  }

  modifyRotateZ(dx, dy) {
    // var e = this.$config.get("bodyEvent");
    var distAngle = Length.deg(
      Math.floor(
        calculateAnglePointDistance(this.rotateZStart, this.rotateZCenter, {
          dx,
          dy,
        })
      )
    );

    this.state.rotateCache.forEach((cache) => {
      let transform = cache.item.transform;
      transform = Transform.rotateZ(
        transform,
        Length.deg(cache.rotateZ.value + distAngle.value)
      );

      cache.item.transform = transform;
    });
  }

  [SUBSCRIBE("refreshSelection")]() {
    this.refresh();
  }

  checkShow() {
    return this.$selection.isOne;
  }

  [SUBSCRIBE("refreshSelectionStyleView") + IF("checkShow")]() {
    if (this.$selection.hasChangedField("transform")) {
      this.refresh();
    }
  }
}
