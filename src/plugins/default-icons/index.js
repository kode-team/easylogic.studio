// import { Editor } from "elf/editor/manager/Editor";

/**
 * register i18n default messages
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerIcon("artboard", "artboard");
  editor.registerIcon("circle", "lens");
  editor.registerIcon("image", "image");
  editor.registerIcon("text", "title");
  editor.registerIcon("svg-text", "title");
  editor.registerIcon("boolean-path", "pentool");
  editor.registerIcon("svg-path", "pentool");
  editor.registerIcon("polygon", "polygon");
  editor.registerIcon("star", "star");
  editor.registerIcon("spline", "smooth");
  editor.registerIcon("rect", "rect");
}
