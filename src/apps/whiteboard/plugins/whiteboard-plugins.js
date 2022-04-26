// import alignment from "plugins/alignment";
// import animation from "plugins/animation";
// import appearance from "plugins/appearance";
// import artboard from "plugins/artboard";
// import backdropFilter from "plugins/backdrop-filter";
// import backgroundClip from "plugins/background-clip";
// import backgroundImage from "plugins/background-image";
import baseEditor from "plugins/base-editor";
// import border from "plugins/border";
// import borderImage from "plugins/border-image";
// import borderRadius from "plugins/border-radius";
// import boxModel from "plugins/box-model";
// import boxShadow from "plugins/box-shadow";
// import clipPath from "plugins/clip-path";
// import ClippathEditorView from "plugins/clippath-editor-view";
// import codeview from "plugins/codeview";
import color from "plugins/color";
// import component from "plugins/component";
// import content from "plugins/content";
import defaultConfigs from "plugins/default-configs";
import defaultIcons from "plugins/default-icons";
import defaultItems from "plugins/default-items";
import defaultMessages from "plugins/default-messages";
import defaultPatterns from "plugins/default-patterns";
// import exportResource from "plugins/export-resource";
import fillEditorView from "plugins/fill-editor-view";
// import filter from "plugins/filter";
// import font from "plugins/font";
import gradient from "plugins/gradient";
// import gradientAsset from "plugins/gradient-asset";
import gradientEditorView from "plugins/gradient-editor-view";
import guideLineView from "plugins/guide-line-view";
import history from "plugins/history";
import hoverView from "plugins/hover-view";
// import image from "plugins/image";
// import imageAsset from "plugins/image-asset";
// import keyframe from "plugins/keyframe";
import layerAppendView from "plugins/layer-append-view";
// import layerTree from "plugins/layer-tree";
// import layout from "plugins/layout";
import pathDrawView from "plugins/path-draw-view";
import pathEditorView from "plugins/path-editor-view";
// import pathTool from "plugins/path-tool";
// import patternAsset from "plugins/pattern-asset";
// import perspective from "plugins/perspective";
// import perspectiveOrigin from "plugins/perspective-origin";
// import position from "plugins/position";
// import project from "plugins/project";
import propertyEditor from "plugins/property-editor";
import rendererHtml from "plugins/renderer-html";
import rendererJson from "plugins/renderer-json";
import rendererSvg from "plugins/renderer-svg";
// import sample from "plugins/sample";
import selectionInfoView from "plugins/selection-info-view";
import selectionToolView from "plugins/selection-tool-view";
// import selector from "plugins/selector";
// import svgFilterAsset from "plugins/svg-filter-asset";
// import svgItem from "plugins/svg-item";
// import svgText from "plugins/svg-text";
// import text from "plugins/text";
// import textShadow from "plugins/text-shadow";
// import transition from "plugins/transition";
// import video from "plugins/video";

export default [
  defaultConfigs,
  defaultIcons,
  defaultMessages,
  defaultItems,
  defaultPatterns,

  rendererHtml,
  rendererJson,
  rendererSvg,

  // common editor

  baseEditor,
  propertyEditor,

  color,
  gradient,

  // inspector.tab.style

  // depth,
  // alignment,
  // position,
  // layout,

  // layout
  // boxModel,
  // pathTool,
  // artboard,

  // text
  // svgText,
  // font,
  // text,
  // textShadow,
  // content,

  // appearance,
  // iframe,
  // component,
  // backgroundImage,
  // patternAsset,
  // border
  // border,
  // borderRadius,

  // resource
  // video,
  // image,
  // transform,
  // transformOrigin,
  // perspective,
  // perspectiveOrigin,

  // svgFilterAsset,

  // svgItem,
  // layerTree,
  // backgroundClip,
  // borderImage,

  // filter,
  // backdropFilter,
  // boxShadow,
  // clipPath,
  // gradientAsset,

  // exportResource,

  // animation
  // transition,
  // keyframe,
  // animation,
  // selector,

  // codeview
  // codeview,

  // history
  history,

  // todo: timeline,
  //timeline
  // project,

  // canvas tool
  selectionInfoView,
  selectionToolView,
  guideLineView,
  layerAppendView,
  hoverView,
  pathDrawView,
  pathEditorView,
  gradientEditorView,
  fillEditorView,
];
