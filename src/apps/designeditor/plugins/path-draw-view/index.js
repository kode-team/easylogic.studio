// import { Editor } from "elf/editor/manager/Editor";
import DrawManager from "./DrawManager";
import PathDrawView from "./PathDrawView";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    PathDrawView,
  });

  editor.registerUI("page.subeditor.view", {
    DrawManager,
  });
}
