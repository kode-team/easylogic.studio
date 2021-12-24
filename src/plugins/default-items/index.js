import { Editor } from "el/editor/manager/Editor";
import { ArtBoard } from "./layers/ArtBoard";
import { CircleLayer } from "./layers/CircleLayer";
// import { CubeLayer } from "./layers/CubeLayer";
// import { CylinderLayer } from "./layers/CylinderLayer";
import { ImageLayer } from "./layers/ImageLayer";
import { Project } from "./layers/Project";
import { RectLayer } from "./layers/RectLayer";
import { SVGPathItem } from "./layers/SVGPathItem";
import { SVGTextItem } from "./layers/SVGTextItem";
import { SVGTextPathItem } from "./layers/SVGTextPathItem";
import { TemplateLayer } from "./layers/TemplateLayer";
import { TextLayer } from "./layers/TextLayer";
// import { VideoLayer } from "./layers/VideoLayer";
import { SVGPolygonItem } from './layers/SVGPolygonItem';
import { SVGStarItem } from "./layers/SVGStarItem";
import { SplineItem } from "./layers/SplineItem";
import { BooleanPathItem } from "./layers/BooleanPathItem";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerItem("project", Project);        
    editor.registerItem("artboard", ArtBoard);
    editor.registerItem("rect", RectLayer);
    editor.registerItem("circle", CircleLayer);
    // editor.registerItem("cube", CubeLayer);
    // editor.registerItem("cylinder", CylinderLayer);
    editor.registerItem("image", ImageLayer);
    editor.registerItem("text", TextLayer);
    editor.registerItem("boolean-path", BooleanPathItem);
    editor.registerItem("svg-path", SVGPathItem);
    editor.registerItem("svg-text", SVGTextItem);
    editor.registerItem("svg-textpath", SVGTextPathItem);
    editor.registerItem("template", TemplateLayer);
    // editor.registerItem("video", VideoLayer);
    editor.registerItem("polygon", SVGPolygonItem)
    editor.registerItem("star", SVGStarItem)
    editor.registerItem("spline", SplineItem)
}