import { Layer } from "../Layer";

export class SVGItem extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg',
      name: "New SVG",
      elementType: 'svg',
      overflow: 'visible',         
      stroke: 'black',
      'stroke-width': 1,
      'svgfilter': '',
      fill: 'transparent',
      'fill-rule': '',
      'fill-opacity': '',
      'stroke-linecap': '',
      'stroke-linejoin': '',      
      'stroke-dashoffset': 0, 
      'stroke-dasharray': ' ',
      'text-anchor': 'start',
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
      svgfilter: json.svgfilter,
      fill: json.fill,
      'fill-rule': json['fill-rule'],
      'fill-opacity': json['fill-opacity'],
      'stroke-linecap': json['stroke-linecap'],
      'stroke-linejoin': json['stroke-linejoin'],
      'stroke-dashoffset': json['stroke-dashoffset'],
      'stroke-dasharray': json['stroke-dasharray'],
      'text-anchor': json['text-anchor'],
      'motion-based': json['motion-based']
    }
  }


  toSVGAttribute () {
    return {
      ...this.toDefaultSVGCSS(),
      ...this.toKeyListCSS(
        'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
        'fill-opacity', 'fill-rule', 'text-anchor'
      )
    }
  }

  getDefaultTitle() {
    return "SVG";
  }


  toExportSVGCode () {
    return `
      ${this.toFillSVG}
      ${this.toStrokeSVG}
    `
  }
}
