import alignment from "./alignment"
import animation from "./animation"
import appearance from "./appearance"
import artboard from "./artboard"
import backdropFilter from "./backdrop-filter"
import backgroundClip from "./background-clip"
import backgroundImage from "./background-image"
import border from "./border"
import borderImage from "./border-image"
import borderRadius from "./border-radius"
import boxModel from "./box-model"
import boxShadow from "./box-shadow"
import clipPath from "./clip-path"
import codeview from "./codeview"
import component from "./component"
import content from "./content"
import exportResource from "./export-resource"
import filter from "./filter"
import font from "./font"
import fontSpacing from "./font-spacing"
import gradientAsset from "./gradient-asset"
import image from "./image"
import keyframe from "./keyframe"
import layerTree from "./layer-tree"
import layout from "./layout"
import patternAsset from "./pattern-asset"
import perspective from "./perspective"
import perspectiveOrigin from "./perspective-origin"
import position from "./position"
import svgFilterAsset from "./svg-filter-asset"
import svgItem from "./svg-item"
import text from "./text"
import textClip from "./text-clip"
import textFill from "./text-fill"
import textShadow from "./text-shadow"
import transform from "./transform"
import transformOrigin from "./transform-origin"
import transition from "./transition"
import video from "./video"


export default [
    alignment,    
    artboard,
    appearance,    
    component,

    // border 
    border,
    borderRadius,    

    // layout 
    layout,

    // resource 
    exportResource,    
    video,
    image,
    
    // animation 
    transition,
    keyframe,
    animation,
    
    patternAsset,
    svgFilterAsset,
    textClip,
    svgItem,
    textFill,

    layerTree,
    backgroundClip,
    transformOrigin,
    perspective,
    perspectiveOrigin,

    transform,
    backdropFilter,
    codeview,
    filter,
    backgroundImage,
    borderImage,
    fontSpacing,
    text,
    textShadow,
    font,
    content,
    boxModel,
    boxShadow,

    position,
    clipPath,
    gradientAsset    
]