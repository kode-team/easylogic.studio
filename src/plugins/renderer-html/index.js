import { Editor } from "el/editor/manager/Editor";
import HTMLRenderer from "./HTMLRenderer";
import ArtBoardRender from "./HTMLRenderer/ArtBoardRender";
import CircleRender from "./HTMLRenderer/CircleRender";
import CubeRender from "./HTMLRenderer/CubeRender";
import ImageRender from "./HTMLRenderer/ImageRender";
import ProjectRender from "./HTMLRenderer/ProjectRender";
import RectRender from "./HTMLRenderer/RectRender";
import SVGPathRender from "./HTMLRenderer/SVGPathRender";
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

    // html renderer 
    editor.registerRendererType('html', new HTMLRenderer(editor))

    // html renderer item 
    editor.registerRenderer('html', 'project', new ProjectRender());
    editor.registerRenderer('html', 'artboard', new ArtBoardRender());
    editor.registerRenderer('html', 'rect', new RectRender());
    editor.registerRenderer('html', 'circle', new CircleRender());
    editor.registerRenderer('html', 'image', new ImageRender());
    editor.registerRenderer('html', 'text', new TextRender());
    editor.registerRenderer('html', 'video', new VideoRender());
    editor.registerRenderer('html', 'svg-path', new SVGPathRender());
    editor.registerRenderer('html', 'svg-text', new SVGTextRender());
    editor.registerRenderer('html', 'svg-textpath', new SVGTextPathRender());
    editor.registerRenderer('html', 'cube', new CubeRender());
    editor.registerRenderer('html', 'template', new TemplateRender());
}