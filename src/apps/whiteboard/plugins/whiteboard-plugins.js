import defaultItems from "apps/designeditor/plugins/default-items";
import fillEditorView from "apps/designeditor/plugins/fill-editor-view";
import gradient from "apps/designeditor/plugins/gradient";
import gradientEditorView from "apps/designeditor/plugins/gradient-editor-view";
import guideLineView from "apps/designeditor/plugins/guide-line-view";
import history from "apps/designeditor/plugins/history";
import hoverView from "apps/designeditor/plugins/hover-view";
import layerAppendView from "apps/designeditor/plugins/layer-append-view";
import pathDrawView from "apps/designeditor/plugins/path-draw-view";
import pathEditorView from "apps/designeditor/plugins/path-editor-view";
import rendererHtml from "apps/designeditor/plugins/renderer-html";
import rendererJson from "apps/designeditor/plugins/renderer-json";
import rendererSvg from "apps/designeditor/plugins/renderer-svg";
import selectionInfoView from "apps/designeditor/plugins/selection-info-view";
import selectionToolView from "apps/designeditor/plugins/selection-tool-view";
import baseEditor from "plugins/base-editor";
import color from "plugins/color";
import defaultConfigs from "plugins/default-configs";
import defaultIcons from "plugins/default-icons";
import defaultMessages from "plugins/default-messages";
import defaultPatterns from "plugins/default-patterns";
import propertyEditor from "plugins/property-editor";

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
