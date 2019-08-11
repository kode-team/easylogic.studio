import { Property } from "../items/Property";
import { RotaMatrixSVGFilter } from "./svg-filter/RotaMatrixSVGFilter";
import { MergeSVGFilter } from "./svg-filter/MergeSVGFilter";
import { CompositeSVGFilter } from "./svg-filter/CompositeSVGFilter";
import { MorphologySVGFilter } from "./svg-filter/MorphologySVGFilter";
import { TurbulenceSVGFilter } from "./svg-filter/TurbulenceSVGFilter";
import { DisplacementMapSVGFilter } from "./svg-filter/DisplacementMapSVGFilter";
import { ColorMatrixSVGFilter } from "./svg-filter/ColorMatrixSVGFilter";
import { ConvolveMatrixSVGFilter } from "./svg-filter/ConvolveMatrixSVGFilter";
import { GaussianBlurSVGFilter } from "./svg-filter/GaussianBlurSVGFilter";
import { FloodSVGFilter } from "./svg-filter/FloodSVGFilter";

export const resultGenerator = (list) => {
  var reference = list.filter(it => it.result).map(it => it.result).join(',')

  return `${reference},-,SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint`
}

const SVG_FILTER_COMMON_ATTRIBUTES = [
  'result'
]


export class SVGFilter extends Property {

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


export const SVGFilterClassName = {
  RotaMatrix: RotaMatrixSVGFilter,
  GaussianBlur: GaussianBlurSVGFilter,
  Flood: FloodSVGFilter,
  Merge: MergeSVGFilter,
  Composite: CompositeSVGFilter,
  Morphology: MorphologySVGFilter,
  Turbulence: TurbulenceSVGFilter,
  DisplacementMap: DisplacementMapSVGFilter,
  ColorMatrix: ColorMatrixSVGFilter,
  ConvolveMatrix: ConvolveMatrixSVGFilter,
};

export const SVGFilterClass = {
  RotaMatrixSVGFilter,
  GaussianBlurSVGFilter,
  FloodSVGFilter,
  MergeSVGFilter,
  CompositeSVGFilter,
  MorphologySVGFilter,
  TurbulenceSVGFilter,
  DisplacementMapSVGFilter,
  ColorMatrixSVGFilter,
  ConvolveMatrixSVGFilter
};
