import { Layer } from "../Layer";
import { SVGFill } from "../../svg-property/SVGFill";

export class SVGItem extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg',
      name: "New SVG",
      elementType: 'svg',
      overflow: 'visible',         
      stroke: 'black',
      'stroke-width': 1,
      fill: 'transparent',
      'fill-rule': '',
      'fill-opacity': '',
      'stroke-linecap': '',
      'stroke-linejoin': '',      
      'stroke-dashoffset': '', 
      'stroke-dasharray': ' ',
      'motion-based': false,
      ...obj
    });
  }


  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      overflow: json.overflow,
      stroke: json.stroke,
      'stroke-width': json['stroke-width'],
      fill: json.fill,
      'fill-rule': json['fill-rule'],
      'fill-opacity': json['fill-opacity'],
      'stroke-linecap': json['stroke-linecap'],
      'stroke-linejoin': json['stroke-linejoin'],
      'stroke-dashoffset': json['stroke-dashoffset'],
      'stroke-dasharray': json['stroke-dasharray'],
      'motion-based': json['motion-based']
    }
  }

  toDefaultCSS() {
    return {
      ...super.toDefaultCSS(),
      ...this.toKeyListCSS(
        'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
        'fill-opacity', 'fill-rule'
      )
    }
  }

  getDefaultTitle() {
    return "SVG";
  }

  get toDefInnerString () {
    return /*html*/`
        ${this.toFillSVG}
        ${this.toStrokeSVG}
    `
  }

  get toDefString () {
    return /*html*/`
      <defs>
        ${this.toDefInnerString}
      </defs>
    `
  }

  get fillId () {
    return this.json.id + 'fill'
  }

  get strokeId () {
    return this.json.id + 'stroke'
  }

  get toFillSVG () {
    return SVGFill.parseImage(this.json.fill || 'transparent').toSVGString(this.fillId);
  }

  get toStrokeSVG () {
    return SVGFill.parseImage(this.json.stroke || 'black').toSVGString(this.strokeId);
  }  

  get toFillValue () {
    return  SVGFill.parseImage(this.json.fill || 'transparent').toFillValue(this.fillId);
  }

  get toStrokeValue () {
    return  SVGFill.parseImage(this.json.stroke || 'black').toFillValue(this.strokeId);
  }  

  toExportSVGCode () {
    return `
      ${this.toFillSVG}
      ${this.toStrokeSVG}
    `
  }
}
