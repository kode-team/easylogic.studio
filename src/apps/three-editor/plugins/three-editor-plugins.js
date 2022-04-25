import baseEditor from "plugins/base-editor";
import component from "plugins/component";
import defaultConfigs from "plugins/default-configs";
import defaultIcons from "plugins/default-icons";
import defaultMessages from "plugins/default-messages";
import layerTree from "plugins/layer-tree";
import project from "plugins/project";
import propertyEditor from "plugins/property-editor";
import threeHelpers from "plugins/three-helpers";

export default [
  defaultConfigs,
  defaultIcons,
  defaultMessages,
  // defaultItems,
  // defaultPatterns,

  // rendererHtml,
  // rendererJson,
  // rendererSvg,

  // common editor

  baseEditor,
  propertyEditor,

  // color,
  // gradient,

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
  component,
  // backgroundImage,
  // patternAsset,
  // // border
  // border,
  // borderRadius,

  // resource

  layerTree,

  // todo: timeline,
  //timeline
  project,

  threeHelpers,
];
