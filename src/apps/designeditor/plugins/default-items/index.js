// import { Editor } from "elf/editor/manager/Editor";
import { ArtBoard } from "./layers/ArtBoard";
import { BooleanPathModel } from "./layers/BooleanPathModel";
import { CircleLayer } from "./layers/CircleLayer";
import { ImageLayer } from "./layers/ImageLayer";
import { PathModel } from "./layers/PathModel";
import { PolygonModel } from "./layers/PolygonModel";
import { Project } from "./layers/Project";
import { RectLayer } from "./layers/RectLayer";
import { SplineModel } from "./layers/SplineModel";
import { StarModel } from "./layers/StarModel";
import { SVGTextItem } from "./layers/SVGTextItem";
import { SVGTextPathItem } from "./layers/SVGTextPathItem";
import { TemplateModel } from "./layers/TemplateModel";
import { TextModel } from "./layers/TextModel";
// import { VideoLayer } from "./layers/VideoLayer";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerItem("project", Project);
  editor.registerItem("artboard", ArtBoard);
  editor.registerItem("rect", RectLayer);
  editor.registerItem("circle", CircleLayer);
  editor.registerItem("image", ImageLayer);
  editor.registerItem("text", TextModel);
  editor.registerItem("boolean-path", BooleanPathModel);
  editor.registerItem("svg-path", PathModel);
  editor.registerItem("svg-text", SVGTextItem);
  editor.registerItem("svg-textpath", SVGTextPathItem);
  editor.registerItem("template", TemplateModel);
  // editor.registerItem("video", VideoLayer);
  editor.registerItem("polygon", PolygonModel);
  editor.registerItem("star", StarModel);
  editor.registerItem("spline", SplineModel);
}
