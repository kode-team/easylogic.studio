import SVGRenderer from "./SVGRenderer";
import ArtBoardRender from "./SVGRenderer/ArtBoardRender";
import BooleanPathRender from "./SVGRenderer/BooleanPathRender";
import CircleRender from "./SVGRenderer/CircleRender";
import IFrameRender from "./SVGRenderer/IFrameRender";
import ImageRender from "./SVGRenderer/ImageRender";
import ProjectRender from "./SVGRenderer/ProjectRender";
import RectRender from "./SVGRenderer/RectRender";
import SplineRender from "./SVGRenderer/SplineRender";
import SVGPathRender from "./SVGRenderer/SVGPathRender";
import SVGPolygonRender from "./SVGRenderer/SVGPolygonRender";
import SVGStarRender from "./SVGRenderer/SVGStarRender";
import SVGTextPathRender from "./SVGRenderer/SVGTextPathRender";
import SVGTextRender from "./SVGRenderer/SVGTextRender";
import TemplateRender from "./SVGRenderer/TemplateRender";
import TextRender from "./SVGRenderer/TextRender";
import VideoRender from "./SVGRenderer/VideoRender";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  // svg renderer
  editor.registerRendererType("svg", new SVGRenderer(editor));

  // svg renderer item
  editor.registerRenderer("svg", "project", new ProjectRender());
  editor.registerRenderer("svg", "artboard", new ArtBoardRender());
  editor.registerRenderer("svg", "rect", new RectRender());
  editor.registerRenderer("svg", "circle", new CircleRender());
  editor.registerRenderer("svg", "image", new ImageRender());
  editor.registerRenderer("svg", "template", new TemplateRender());
  editor.registerRenderer("svg", "iframe", new IFrameRender());
  editor.registerRenderer("svg", "video", new VideoRender());
  editor.registerRenderer("svg", "text", new TextRender());
  editor.registerRenderer("svg", "boolean-path", new BooleanPathRender());
  editor.registerRenderer("svg", "svg-path", new SVGPathRender());
  editor.registerRenderer("svg", "polygon", new SVGPolygonRender());
  editor.registerRenderer("svg", "star", new SVGStarRender());
  editor.registerRenderer("svg", "spline", new SplineRender());
  editor.registerRenderer("svg", "svg-text", new SVGTextRender());
  editor.registerRenderer("svg", "svg-textpath", new SVGTextPathRender());
}
