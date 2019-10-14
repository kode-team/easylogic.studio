import { Property } from "../../items/Property";
import { uuidShort } from "../../../util/functions/math";
import { SVGFilterClassName } from "../SVGFilter";
import { clone, isString } from "../../../util/functions/func";

export const resultGenerator = (list) => {
  var reference = list.filter(it => it.result).map(it => it.result).join(',')

  return `${reference},-,SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint`
}

const SVG_FILTER_COMMON_ATTRIBUTES = [
  'result'
]

const  Primitive = 'SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint'


export class BaseSVGFilter extends Property {

  static parse (obj) {
    var FilterClass = SVGFilterClassName[obj.type];
  
    return new FilterClass(obj);
  }  


  isSource () {
    return false; 
  }

  getDefaultObject(obj = {}) {
    var id  = uuidShort()
    return super.getDefaultObject({ 
      itemType: "svgfilter", 
      id,
      in: [],
      bound: { x: 100, y: 100, targetX: 0, targetY: 0 },
      connected: [],
      ...obj 
    });
  }

  getInCount () {
    return 0; 
  }

  setIn  (index, target) {
    console.log(index, target)
    this.json.in[index] = {id: target.id, type: target.type}; 
  }

  setConnected (target, path) {

    var f = this.json.connected.filter(c => c.id === target.id);

    if (f.length === 0) {
      this.json.connected.push({id: target.id,  path});
    }

  }  

  convert(json) {


    if (isString(json.in)) {
      json.in = JSON.parse(json.in);
    }
    if (isString(json.bound)) {
      json.bound = JSON.parse(json.bound);  
    }

    if (isString(json.connected)) {
      json.connected = JSON.parse(json.connected);  
    }

    
    return json; 
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      id: this.json.id,
      in: clone(this.json.in),
      bound: clone(this.json.bound),
      connected: clone(this.json.connected)
    }
  }

  getDefaultAttribute () {
    var list = [] 

    if (this.json.connected.length) {
      list.push(`result="${this.json.id}result"`)
    }

    return list.join(' ') + this.getSourceInAttribute();
  }

  getSourceInAttribute (inList) {
    return (inList || this.json.in).map((it, index) => {

      var indexString = index === 0 ? '' : index + '' 

      if (Primitive.includes(it.type)) {
        return `in${indexString}="${it.type}"`
      }
      return `in${indexString}="${it.id}result"`
    }).join(' ')
  }


  toString() {
    var { type , value } = this.json; 
    return `<fe${type} value="${value}" ${this.getDefaultAttribute()} />`;
  }
}


