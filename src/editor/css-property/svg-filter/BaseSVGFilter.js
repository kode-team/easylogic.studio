import { Property } from "../../items/Property";

export const resultGenerator = (list) => {
  var reference = list.filter(it => it.result).map(it => it.result).join(',')

  return `${reference},-,SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint`
}

const SVG_FILTER_COMMON_ATTRIBUTES = [
  'result'
]


export class BaseSVGFilter extends Property {

  static parse (obj) {
    var FilterClass = SVGFilterClassName[obj.type];
  
    return new FilterClass(obj);
  }  


  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ 
      itemType: "svgfilter", 
      result: '',
      ...obj 
    });
  }

  getDefaultAttribute () {
    return SVG_FILTER_COMMON_ATTRIBUTES.map(key => {
      return `${key}="${this.json[key]}"`
    }).join(' ')
  }

  toString() {
    var { type , value } = this.json; 
    return `<fe${type} value="${value}" ${this.getDefaultAttribute()} />`;
  }
}
