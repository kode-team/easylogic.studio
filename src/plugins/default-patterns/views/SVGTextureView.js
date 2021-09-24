import { CLICK, LOAD } from "el/sapa/Event";
import { EditorElement } from 'el/editor/ui/common/EditorElement';

import './TextureView.scss';
import PathParser from 'el/editor/parser/PathParser';
import PathStringManager from "el/editor/parser/PathStringManager";

const svgPatterns = [
  {
    itemType: "svg-path", name: "path", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      d: PathStringManager.makeRect(0, 0, 100, 100)
    }
  },
  {
    itemType: "svg-path", name: "triangle", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      d: "M 50 0 L 100 100 L 0 100 Z"
    }
  },
  {
    itemType: "svg-path", name: "circle", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      d: PathStringManager.makeCircle(0, 0, 100, 100)
    }
  },

]



export default class SVGTextureView extends EditorElement {

  template() {
    return /*html*/`
      <div class="pattern-list svg-pattern-list" ref="$svg-list"></div>
    `;
  }

  [LOAD('$svg-list')]() {
    return svgPatterns.map((it, index) => {

      let d = it.attrs.d; 

      if (d) {
        const path = new PathParser(d);
        const rect = path.rect();
        path.scale(70/rect.width, 70/rect.height)
        d = path.d; 
      }

      const svg = this.$editor.svg.render(this.$model.createModel({
        itemType: it.itemType,
        width: 80, 
        height: 80,
        ...it.attrs,
        d
      }, false))
      return /*html*/`
        <div class="pattern-item" data-index="${index}">
          <div class="preview">${svg}</div>
        </div>
      `;
    });
  }  

  [CLICK('$svg-list .pattern-item')](e) {
    const index = +e.$dt.data('index');
    const pattern = svgPatterns[index];

    e.$dt.onlyOneClass("selected");

    this.emit("addLayerView", pattern.itemType, pattern.attrs);
  }
}