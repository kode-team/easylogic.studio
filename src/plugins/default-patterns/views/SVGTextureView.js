import { CLICK, LOAD } from "el/sapa/Event";
import { EditorElement } from 'el/editor/ui/common/EditorElement';

import './TextureView.scss';
import PathParser from 'el/editor/parser/PathParser';
// import PathStringManager from "el/editor/parser/PathStringManager";
// import math from "./data/math";

const svgPatterns = [
  {
    itemType: "svg-path", name: "path", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      d: PathParser.makeRect(0, 0, 100, 100).d
    }
  },
  {
    itemType: "svg-path", name: "line", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      d: PathParser.makeLine(0, 0, 100, 100).d
    }
  },  
  {
    itemType: "svg-path", name: "line 2", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      d: PathParser.makeLine(0, 100, 100, 0).d
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
      originWidth: 100,
      originHeight: 100,      
      d: PathParser.makeCircle(0, 0, 100, 100).d
    }
  },
  {
    itemType: "svg-path", name: "polygon - 3", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      originWidth: 100,
      originHeight: 100,      
      d: PathParser.makePolygon(100, 100, 3).d
    }
  }, 
  {
    itemType: "svg-path", name: "polygon - 4", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      originWidth: 100,
      originHeight: 100,      
      d: PathParser.makePolygon(100, 100, 4).d
    }
  }, 
  {
    itemType: "svg-path", name: "polygon - 4", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      originWidth: 100,
      originHeight: 100,      
      d: PathParser.makePolygon(100, 100, 5).d
    }
  }, 
  
  {
    itemType: "svg-path", name: "polygon - 4", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      originWidth: 100,
      originHeight: 100,      
      d: PathParser.makePolygon(100, 100, 6).d
    }
  }, 
  
  {
    itemType: "svg-path", name: "polygon - 4", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      originWidth: 100,
      originHeight: 100,
      d: PathParser.makePolygon(100, 100, 7).d
    }
  },   

  {
    itemType: "svg-path", name: "polygon - 4", attrs: {
      'background-color': 'transparent',
      stroke: 'black',
      'stroke-width': 2,
      originWidth: 100,
      originHeight: 100,
      d: PathParser.makePolygon(100, 100, 12).d
    }
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
        
        const path = PathParser.fromSVGString(d);

        if (it.attrs.originWidth) {
          const rect = path.rect();
          path.scale(70/it.attrs.originWidth, 70/it.attrs.originHeight)
        } else {
          const rect = path.rect();
          path.scale(70/rect.width, 70/rect.height)
        }

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