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
import color from "./color"
import component from "./component"
import content from "./content"
import defaultConfigs from "./default-configs"
import defaultItems from "./default-items"
import defaultMessages from "./default-messages"

import exportResource from "./export-resource"
import filter from "./filter"
import font from "./font"
import fontSpacing from "./font-spacing"
import gradient from "./gradient"
import gradientAsset from "./gradient-asset"
import history from "./history"
import iframe from "./iframe"
import image from "./image"
import keyframe from "./keyframe"
import layerTree from "./layer-tree"
import layout from "./layout"
import patternAsset from "./pattern-asset"
import perspective from "./perspective"
import perspectiveOrigin from "./perspective-origin"
import position from "./position"
import propertyEditor from "./property-editor"
import rendererHtml from "./renderer-html"
import rendererJson from "./renderer-json"
import rendererSvg from "./renderer-svg"
import selector from "./selector"
import svgFilterAsset from "./svg-filter-asset"
import svgItem from "./svg-item"
import svgText from "./svg-text"
import text from "./text"
import textClip from "./text-clip"
import textFill from "./text-fill"
import textShadow from "./text-shadow"
// import timeline from "./timeline"
import transform from "./transform"
import transformOrigin from "./transform-origin"
import transition from "./transition"
import video from "./video"



export default [

    defaultConfigs,
    defaultMessages,
    defaultItems,

    rendererHtml,
    rendererJson,
    rendererSvg,

    // common editor 
    propertyEditor,
    color,
    gradient,

    // inspector.tab.style    
    alignment,
    artboard,
    // layout 
    layout,    
    transform,
    // transformOrigin,    
    appearance,
    perspective,
    perspectiveOrigin,

    // iframe,
    component,
    backgroundImage,
    // border 
    border,
    borderRadius,

    svgText,
    font,
    text,
    textShadow,
    fontSpacing,
    content,
    textFill,
    textClip,     


    // resource    
    video,
    image,


    patternAsset,
    svgFilterAsset,

    svgItem,
    layerTree,
    backgroundClip,
    borderImage,

    filter,
    backdropFilter,
    boxShadow,
    clipPath,
    boxModel,
    position,
    gradientAsset,

    exportResource,



    // animation 
    transition,
    keyframe,
    animation,
    selector,

    // codeview 
    codeview,

    // history
    history,

    // todo: timeline,
    //timeline
]