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
import { ComponentTransferSVGFilter } from "./svg-filter/ComponentTransferSVGFilter";
import { DistantLightSVGFilter } from "./svg-filter/DistantLightSVGFilter";
import { PointLightSVGFilter } from "./svg-filter/PointLightSVGFilter";
import { SpotLightSVGFilter } from "./svg-filter/SpotLightSVGFilter";
import { DiffuseLightingSVGFilter } from "./svg-filter/DiffuseLightingSVGFilter";
import { SpecularLightingSVGFilter } from "./svg-filter/SpecularLightingSVGFilter";
import { OffsetSVGFilter } from "./svg-filter/OffsetSVGFilter";
import { BlendSVGFilter } from "./svg-filter/BlendSVGFilter";
import { SourceGraphicSVGFilter } from "./svg-filter/SourceGraphicSVGFilter";
import { SourceAlphaSVGFilter } from "./svg-filter/SourceAlphaSVGFilter";
import { BackgroundImageSVGFilter } from "./svg-filter/BackgroundImageSVGFilter";
import { BackgroundAlphaSVGFilter } from "./svg-filter/BackgroundAlphaSVGFilter";
import { FillPaintSVGFilter } from "./svg-filter/FillPaintSVGFilter";
import { StrokePaintSVGFilter } from "./svg-filter/StrokePaintSVGFilter";
import { DropShadowSVGFilter } from "./svg-filter/DropShadowSVGFilter";
import { SaturateSVGFilter } from "./svg-filter/SaturateSVGFilter";
import { HueRotateSVGFilter } from "./svg-filter/HueRotateSVGFilter";
import { LuminanceAlphaSVGFilter } from "./svg-filter/LuminanceAlphaSVGFilter";
import { TileSVGFilter } from "./svg-filter/TileSVGFilter";

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
  Tile: TileSVGFilter,
  Saturate: SaturateSVGFilter,
  HueRotate: HueRotateSVGFilter,
  LuminanceAlpha: LuminanceAlphaSVGFilter,
  DropShadow: DropShadowSVGFilter,
  SourceGraphic: SourceGraphicSVGFilter,
  SourceAlpha: SourceAlphaSVGFilter,
  BackgroundImage: BackgroundImageSVGFilter,
  BackgroundAlpha: BackgroundAlphaSVGFilter,
  FillPaint: FillPaintSVGFilter,
  StrokePaint: StrokePaintSVGFilter,
  ComponentTransfer: ComponentTransferSVGFilter,
  DistantLight: DistantLightSVGFilter,
  PointLight: PointLightSVGFilter,
  SpotLight: SpotLightSVGFilter,
  DiffuseLighting: DiffuseLightingSVGFilter,
  SpecularLighting: SpecularLightingSVGFilter,
  Blend: BlendSVGFilter,
  Offset: OffsetSVGFilter,
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
  TileSVGFilter,
  SaturateSVGFilter,
  HueRotateSVGFilter,
  LuminanceAlphaSVGFilter,  
  DropShadowSVGFilter,
  SourceAlphaSVGFilter,
  SourceGraphicSVGFilter,
  BackgroundImageSVGFilter,
  BackgroundAlphaSVGFilter,
  FillPaintSVGFilter,
  StrokePaintSVGFilter,
  ComponentTransferSVGFilter,
  DistantLightSVGFilter,
  PointLightSVGFilter,
  SpotLightSVGFilter,
  DiffuseLightingSVGFilter,
  SpecularLightingSVGFilter,
  BlendSVGFilter,
  OffsetSVGFilter,
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



export const SVGFilterSpecList = {
  Tile: TileSVGFilter.spec,
  DropShadow: DropShadowSVGFilter.spec,
  Saturate: SaturateSVGFilter.spec,
  HueRotate: HueRotateSVGFilter.spec,
  LuminanceAlpha: LuminanceAlphaSVGFilter.spec,  
  Offset: OffsetSVGFilter.spec,
  ComponentTransfer: ComponentTransferSVGFilter.spec,
  SpecularLighting: SpecularLightingSVGFilter.spec,
  SpotLight: SpotLightSVGFilter.spec,
  PointLight: PointLightSVGFilter.spec,
  DistantLight:DistantLightSVGFilter.spec,  
  DiffuseLighting: DiffuseLightingSVGFilter.spec,
  Blend: BlendSVGFilter.spec,
  RotaMatrix: RotaMatrixSVGFilter.spec,
  Merge: MergeSVGFilter.spec,
  GaussianBlur: GaussianBlurSVGFilter.spec,
  Flood: FloodSVGFilter.spec,
  Morphology: MorphologySVGFilter.spec,
  Composite: CompositeSVGFilter.spec,
  Turbulence: TurbulenceSVGFilter.spec,
  DisplacementMap: DisplacementMapSVGFilter.spec,
  ColorMatrix: ColorMatrixSVGFilter.spec,
  ConvolveMatrix: ConvolveMatrixSVGFilter.spec
}; 
