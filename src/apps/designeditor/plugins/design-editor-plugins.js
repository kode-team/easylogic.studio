import { ContextMenuView } from "../../common/area/context/ContextMenuView";
import alignment from "./alignment";
import animation from "./animation";
import appearance from "./appearance";
import artboard from "./artboard";
import backdropFilter from "./backdrop-filter";
import backgroundClip from "./background-clip";
import backgroundImage from "./background-image";
import border from "./border";
import borderImage from "./border-image";
import borderRadius from "./border-radius";
import boxModel from "./box-model";
import boxShadow from "./box-shadow";
import clipPath from "./clip-path";
import ClippathEditorView from "./clippath-editor-view";
import codeview from "./codeview";
import commands from "./commands";
import configs from "./configs";
import defaultItems from "./default-items";
import defaultPatterns from "./default-patterns";
import exportResource from "./export-resource";
import fillEditorView from "./fill-editor-view";
import filter from "./filter";
import font from "./font";
import gradient from "./gradient";
import gradientAsset from "./gradient-asset";
import gradientEditorView from "./gradient-editor-view";
import guideLineView from "./guide-line-view";
import history from "./history";
import hoverView from "./hover-view";
import image from "./image";
import imageAsset from "./image-asset";
import keyframe from "./keyframe";
import layerAppendView from "./layer-append-view";
import layerTree from "./layer-tree";
import layout from "./layout";
import lineView from "./line-view";
import pathDrawView from "./path-draw-view";
import pathEditorView from "./path-editor-view";
import pathTool from "./path-tool";
import patternAsset from "./pattern-asset";
import perspective from "./perspective";
import perspectiveOrigin from "./perspective-origin";
import position from "./position";
import project from "./project";
import rendererHtml from "./renderer-html";
import rendererJson from "./renderer-json";
import rendererSvg from "./renderer-svg";
import sample from "./sample";
import selectionInfoView from "./selection-info-view";
import selectionToolView from "./selection-tool-view";
import selector from "./selector";
import svgFilterAsset from "./svg-filter-asset";
import svgItem from "./svg-item";
import svgText from "./svg-text";
import text from "./text";
import textShadow from "./text-shadow";
import transition from "./transition";
import video from "./video";

import baseEditor from "plugins/base-editor";
import color from "plugins/color";
import component from "plugins/component";
import content from "plugins/content";
import defaultConfigs from "plugins/default-configs";
import defaultIcons from "plugins/default-icons";
import defaultMessages from "plugins/default-messages";
import propertyEditor from "plugins/property-editor";

export default [
  configs,
  commands,
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
  alignment,
  position,
  layout,

  // layout
  boxModel,
  pathTool,
  artboard,

  // text
  svgText,
  font,
  text,
  textShadow,
  content,

  appearance,
  // iframe,
  component,
  backgroundImage,
  patternAsset,
  // border
  border,
  borderRadius,

  // resource
  video,
  image,
  // transform,
  // transformOrigin,
  perspective,
  perspectiveOrigin,

  svgFilterAsset,

  svgItem,
  layerTree,
  backgroundClip,
  borderImage,

  filter,
  backdropFilter,
  boxShadow,
  clipPath,
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
  project,

  // canvas tool
  selectionInfoView,
  selectionToolView,
  guideLineView,
  layerAppendView,
  lineView,
  hoverView,
  pathDrawView,
  pathEditorView,
  gradientEditorView,
  fillEditorView,
  ClippathEditorView,

  // image asset
  imageAsset,

  // sample
  sample,

  function (editor) {
    editor.registerMenu("context.menu.layer2", [
      {
        type: "button",
        title: "Layer",
      },
    ]);

    // menu 를 등록 하고
    editor.registerMenu("context.menu.layer", [
      {
        type: "button",
        title: "Sample",
      },
      {
        type: "button",
        title: "Sample",
      },
      {
        type: "button",
        title: "Sample",
        action: (editor) => {
          console.log(editor);
        },
      },
      {
        type: "button",
        title: "Sample",
      },
      {
        type: "dropdown",
        title: "dropdown",
        items: [
          {
            title: "menu.item.fullscreen.title",
            command: "toggle.fullscreen",
            shortcut: "ALT+/",
            closable: true,
          },
        ],
      },
    ]);

    // 렌더링 되는 것 까지는 알겠는데
    editor.registerUI("context.menu", {
      ContextMenuView,
    });

    // context 메뉴는 조건에 따라 열려야 하기 때문에
    // 때로는 합쳐질 수도 있어서
    // 각각의 메뉴가 동적으로 열리는 방식을 정의해야할 듯
    // inspector 처럼 함수로 받아야 할 듯 하다.
  },
];
