import { CLICK, LOAD } from "sapa";

import "./TextureView.scss";

import { PathParser } from "elf/editor/parser/PathParser";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

// import { repeat } from "elf/utils/func";
// import PathStringManager from "elf/editor/parser/PathStringManager";
// import math from "./data/math";
// import { Length } from "elf/editor/unit/Length";

const svgPatterns = [
  {
    itemType: "svg-path",
    name: "path",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      d: PathParser.makeRect(0, 0, 80, 80).d,
    },
  },
  {
    itemType: "svg-path",
    name: "line",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      d: PathParser.makeLine(0, 0, 80, 80).d,
    },
  },
  {
    itemType: "svg-path",
    name: "line 2",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      d: PathParser.makeLine(0, 80, 80, 0).d,
    },
  },
  {
    itemType: "svg-path",
    name: "circle",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      originWidth: 80,
      originHeight: 80,
      d: PathParser.makeCircle(0, 0, 80, 80).d,
    },
  },
  {
    itemType: "polygon",
    name: "polygon - 3",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      count: 3,
      originWidth: 80,
      originHeight: 80,
      d: PathParser.makePolygon(80, 80, 3).d,
    },
  },
  {
    itemType: "polygon",
    name: "polygon - 4",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      count: 4,
      originWidth: 80,
      originHeight: 80,
      d: PathParser.makePolygon(80, 80, 4).d,
    },
  },
  {
    itemType: "polygon",
    name: "polygon - 4",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      count: 5,
      originWidth: 80,
      originHeight: 80,
      d: PathParser.makePolygon(80, 80, 5).d,
    },
  },

  {
    itemType: "polygon",
    name: "polygon - 4",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      count: 6,
      originWidth: 80,
      originHeight: 80,
      d: PathParser.makePolygon(80, 80, 6).d,
    },
  },

  {
    itemType: "polygon",
    name: "polygon - 4",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      count: 7,
      originWidth: 80,
      originHeight: 80,
      d: PathParser.makePolygon(80, 80, 7).d,
    },
  },

  {
    itemType: "polygon",
    name: "polygon - 4",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      count: 12,
      originWidth: 80,
      originHeight: 80,
      d: PathParser.makePolygon(80, 80, 12).d,
    },
  },
  {
    itemType: "star",
    name: "star - 5",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      originWidth: 80,
      originHeight: 80,
      count: 5,
      radius: 0.5,
      d: PathParser.makeStar(80, 80, 5, 0.5).d,
    },
  },
  {
    itemType: "star",
    name: "curved star - 5",
    attrs: {
      "background-color": "transparent",
      stroke: "black",
      "stroke-width": 2,
      fill: "#ececec",
      originWidth: 80,
      originHeight: 80,
      count: 5,
      radius: 0.5,
      d: PathParser.makeCurvedStar(80, 80, 5, 0.5).d,
    },
  },
  // ...Object.entries(math.data).map(([name, data]) => {
  //   console.log(data);
  //   return {
  //     itemType: "svg-path",
  //     name,
  //     attrs: {
  //       'background-color': 'transparent',
  //       stroke: 'black',
  //       'stroke-width': 2,
  //       d: data
  //     }
  //   };
  // })
];

export default class SVGTextureView extends EditorElement {
  template() {
    return /*html*/ `
      <div class="pattern-list svg-pattern-list" ref="$svg-list"></div>
    `;
  }

  [LOAD("$svg-list")]() {
    return svgPatterns.map((it, index) => {
      let d = it.attrs.d;

      if (d) {
        const path = PathParser.fromSVGString(d);

        if (it.attrs.originWidth) {
          // const rect = path.rect();
          path.scale(60 / it.attrs.originWidth, 60 / it.attrs.originHeight);
        } else {
          const rect = path.rect();
          path.scale(70 / rect.width, 70 / rect.height);
        }

        d = path.d;
      }

      const svg = this.$editor.svg.render(
        this.$model.createModel(
          {
            itemType: it.itemType,
            width: 80,
            height: 80,
            ...it.attrs,
            d,
          },
          false
        )
      );
      return /*html*/ `
        <div class="pattern-item" data-index="${index}">
          <div class="preview">${svg}</div>
        </div>
      `;
    });
  }

  [CLICK("$svg-list .pattern-item")](e) {
    const index = +e.$dt.data("index");
    const pattern = svgPatterns[index];

    e.$dt.onlyOneClass("selected");

    this.emit("addLayerView", pattern.itemType, pattern.attrs);
  }
}
