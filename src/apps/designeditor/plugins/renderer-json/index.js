// import { Editor } from "elf/editor/manager/Editor";
import JSONRenderer from "./JSONRenderer";
import ArtBoardRender from "./JSONRenderer/ArtBoardRender";
import BooleanPathRender from "./JSONRenderer/BooleanPathRender";
import CircleRender from "./JSONRenderer/CircleRender";
import IFrameRender from "./JSONRenderer/IFrameRender";
import ImageRender from "./JSONRenderer/ImageRender";
import ProjectRender from "./JSONRenderer/ProjectRender";
import RectRender from "./JSONRenderer/RectRender";
import SplineRender from "./JSONRenderer/SplineRender";
import SVGPathRender from "./JSONRenderer/SVGPathRender";
import SVGPolygonRender from "./JSONRenderer/SVGPolygonRender";
import SVGStarRender from "./JSONRenderer/SVGStarRender";
import SVGTextPathRender from "./JSONRenderer/SVGTextPathRender";
import SVGTextRender from "./JSONRenderer/SVGTextRender";
import TemplateRender from "./JSONRenderer/TemplateRender";
import TextRender from "./JSONRenderer/TextRender";
import VideoRender from "./JSONRenderer/VideoRender";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  // json renderer
  editor.registerRendererType("json", new JSONRenderer(editor));

  // json renderer item
  editor.registerRenderer("json", "project", new ProjectRender());
  editor.registerRenderer("json", "artboard", new ArtBoardRender());
  editor.registerRenderer("json", "rect", new RectRender());
  editor.registerRenderer("json", "circle", new CircleRender());
  editor.registerRenderer("json", "image", new ImageRender());
  editor.registerRenderer("json", "template", new TemplateRender());
  editor.registerRenderer("json", "iframe", new IFrameRender());
  editor.registerRenderer("json", "text", new TextRender());
  editor.registerRenderer("json", "video", new VideoRender());
  editor.registerRenderer("json", "svg-path", new SVGPathRender());
  editor.registerRenderer("json", "boolean-path", new BooleanPathRender());
  editor.registerRenderer("json", "polygon", new SVGPolygonRender());
  editor.registerRenderer("json", "star", new SVGStarRender());
  editor.registerRenderer("json", "spline", new SplineRender());
  editor.registerRenderer("json", "svg-text", new SVGTextRender());
  editor.registerRenderer("json", "svg-textpath", new SVGTextPathRender());
}
