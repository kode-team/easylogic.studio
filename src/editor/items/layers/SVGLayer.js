import { Layer } from "../Layer";

export class SVGLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg',
      name: "New Canvas",
      elementType: 'svg',
      viewBox: '',
      src: '',

      // svg  영역을 path 가 넘어가도 화면에 표시 해줌 
      overflow: 'visible',
      ...obj
    });
  }
 
  toCloneObject() {
    return {
      ...super.toCloneObject(),
      viewBox: this.json.viewBox,
      overflow: this.json.overflow,
    }
  }

  getDefaultTitle() {
    return "SVG";
  }


  get html () {
    var {id, layers, overflow, viewBox} = this.json;

    return `
    <svg class='element-item svg' data-id="${id}" overflow="${overflow}" ${viewBox ? `viewBox='${viewBox}'` : ''} >
        ${layers.map(it => it.html).join('')}
    </svg>
    `
  }
}
