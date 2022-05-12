import HTMLIFrameRender from "./HTMLIFrameRender";
import { IFrameLayer } from "./IFrameLayer";
import IFrameProperty from "./IFrameProperty";

// import { Editor } from "elf/editor/manager/Editor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerComponent("iframe", IFrameLayer);

  editor.registerUI("inspector.tab.style", {
    IFrameProperty,
  });

  editor.registerRenderer("html", "iframe", new HTMLIFrameRender());
}
