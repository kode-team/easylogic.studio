import SkiaRenderer from "./SkiaRenderer";
import ArtBoardRender from "./SkiaRenderer/ArtBoardRender";
// import CircleRender from "./SkiaRenderer/CircleRender";
// import CubeRender from "./SkiaRenderer/CubeRender";
import ImageRender from "./SkiaRenderer/ImageRender";
import ProjectRender from "./SkiaRenderer/ProjectRender";

// import { Editor } from "elf/editor/manager/Editor";
// import RectRender from "./SkiaRenderer/RectRender";
// import SVGPathRender from "./SkiaRenderer/SVGPathRender";
// import SVGTextPathRender from "./SkiaRenderer/SVGTextPathRender";
// import SVGTextRender from "./SkiaRenderer/SVGTextRender";
// import TemplateRender from "./SkiaRenderer/TemplateRender";
// import TextRender from "./SkiaRenderer/TextRender";
// import VideoRender from "./SkiaRenderer/VideoRender";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  // html renderer
  editor.registerRendererType("skia", new SkiaRenderer(editor));

  // html renderer item
  editor.registerRenderer("skia", "project", new ProjectRender());
  editor.registerRenderer("skia", "artboard", new ArtBoardRender());
  // editor.registerRenderer('skia', 'rect', new RectRender());
  // editor.registerRenderer('skia', 'circle', new CircleRender());
  editor.registerRenderer("skia", "image", new ImageRender());
  // editor.registerRenderer('skia', 'text', new TextRender());
  // editor.registerRenderer('skia', 'video', new VideoRender());
  // editor.registerRenderer('skia', 'svg-path', new SVGPathRender());
  // editor.registerRenderer('skia', 'svg-text', new SVGTextRender());
  // editor.registerRenderer('skia', 'svg-textpath', new SVGTextPathRender());
  // editor.registerRenderer('skia', 'cube', new CubeRender());
  // editor.registerRenderer('skia', 'template', new TemplateRender());
}
