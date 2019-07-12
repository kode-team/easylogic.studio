import { Layer } from "../Layer";
import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";

export class SVGPathItem extends SVGItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-path',
      name: "New Path",
      elementType: 'path',
      d: '',
      path: new PathParser(),
      stroke: 'black',
      'stroke-width': 3,
      ...obj
    });
  }

  convert(json) {

    if (json.d)  {
      json.path = new PathParser(json.d);
    }

    return json;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      d: this.json.path.toString()
    }
  }

  getDefaultTitle() {
    return "Path";
  }

  get html () {
    var {id, path} = this.json;

    return `
      <path class='svg-path-item' data-id="${id}" d="${path.toString()}"></path>
    `
  }
}
