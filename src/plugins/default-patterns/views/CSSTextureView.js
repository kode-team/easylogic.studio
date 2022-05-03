import { CLICK, LOAD } from "sapa";

import "./TextureView.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

const cssPatterns = [
  {
    itemType: "circle",
    name: "base",
    attrs: {
      "background-color": "#ececec",
    },
  },
  {
    itemType: "circle",
    name: "base",
    attrs: {
      "background-color": "black",
    },
  },
  {
    itemType: "circle",
    name: "base",
    attrs: {
      "background-color": "red",
    },
  },
  {
    itemType: "circle",
    name: "base",
    attrs: {
      "background-image": `
      background-image: linear-gradient(to right, #ececec, black 100%);
    `,
    },
  },
  {
    itemType: "circle",
    name: "base",
    attrs: {
      "background-image": `
      background-image: linear-gradient(to right, #ececec, black 100%);
    `,
      border: `
      border:10px solid black;
    `,
    },
  },
];

export default class CSSTextureView extends EditorElement {
  template() {
    return /*html*/ `
      <div class="pattern-list css-pattern-list" ref="$css-list"></div>
    `;
  }

  [LOAD("$css-list")]() {
    return cssPatterns.map((it, index) => {
      const svg = this.$editor.svg.render(
        this.$model.createModel(
          {
            itemType: it.itemType,
            width: 70,
            height: 70,
            ...it.attrs,
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

  [CLICK("$css-list .pattern-item")](e) {
    const index = +e.$dt.data("index");
    const pattern = cssPatterns[index];

    e.$dt.onlyOneClass("selected");

    this.emit("addLayerView", pattern.itemType, pattern.attrs);
  }
}
