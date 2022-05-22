// import { Editor } from "elf/editor/manager/Editor";
import HTMLRenderer from "./HTMLRenderer";
import ArtBoardRender from "./HTMLRenderer/ArtBoardRender";
import BooleanPathRender from "./HTMLRenderer/BooleanPathRender";
import CircleRender from "./HTMLRenderer/CircleRender";
import ImageRender from "./HTMLRenderer/ImageRender";
import ProjectRender from "./HTMLRenderer/ProjectRender";
import RectRender from "./HTMLRenderer/RectRender";
import SplineRender from "./HTMLRenderer/SplineRender";
import SVGPathRender from "./HTMLRenderer/SVGPathRender";
import SVGPolygonRender from "./HTMLRenderer/SVGPolygonRender";
import SVGStarRender from "./HTMLRenderer/SVGStarRender";
import SVGTextPathRender from "./HTMLRenderer/SVGTextPathRender";
import SVGTextRender from "./HTMLRenderer/SVGTextRender";
import TemplateRender from "./HTMLRenderer/TemplateRender";
import TextRender from "./HTMLRenderer/TextRender";
import VideoRender from "./HTMLRenderer/VideoRender";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  const renderer = new HTMLRenderer(editor);

  // html renderer item
  renderer.setRendererType("project", new ProjectRender());
  renderer.setRendererType("artboard", new ArtBoardRender());
  renderer.setRendererType("rect", new RectRender());
  renderer.setRendererType("circle", new CircleRender());
  renderer.setRendererType("image", new ImageRender());
  renderer.setRendererType("text", new TextRender());
  renderer.setRendererType("video", new VideoRender());
  renderer.setRendererType("boolean-path", new BooleanPathRender());
  renderer.setRendererType("svg-path", new SVGPathRender());
  renderer.setRendererType("polygon", new SVGPolygonRender());
  renderer.setRendererType("star", new SVGStarRender());
  renderer.setRendererType("spline", new SplineRender());
  renderer.setRendererType("svg-text", new SVGTextRender());
  renderer.setRendererType("svg-textpath", new SVGTextPathRender());
  renderer.setRendererType("template", new TemplateRender());

  // html renderer
  editor.registerRendererType("html", renderer);
}
