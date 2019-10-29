import { Layer } from "../Layer";
import { SVGFill } from "../../svg-property/SVGFill";
import Dom from "../../../util/Dom";

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
      'stroke-dashoffset': '', 
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

  toDefaultCSS() {
    return {
      ...super.toDefaultCSS(),
      ...this.toKeyListCSS(
        'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
        'fill-opacity', 'fill-rule', 'text-anchor'
      )
    }
  }

  getDefaultTitle() {
    return "SVG";
  }


  updateDefString (currentElement) {

    var $defs = currentElement.$('defs');
    if ($defs) {
      $defs.html(this.toDefInnerString)          
    } else {
      if (this.toDefString) {
        currentElement.prepend(Dom.createByHTML(this.toDefString));
      }

    }      
  }  

  get toDefInnerString () {
    return /*html*/`
        ${this.toFillSVG}
        ${this.toStrokeSVG}
    `
  }

  get toDefString () {

    var str = this.toDefInnerString.trim();

    if (!str) return ''; 

    return /*html*/`
      <defs>
        ${str}
      </defs>
    `
  }

  get fillId () {
    return this.getInnerId('fill')
  }

  get strokeId () {
    return this.getInnerId('stroke')
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

  get toFilterValue () {

    if (!this.json.svgfilter) {
      return '';
    }

    return `url(#${this.json.svgfilter})`
  }

  toExportSVGCode () {
    return `
      ${this.toFillSVG}
      ${this.toStrokeSVG}
    `
  }
}
