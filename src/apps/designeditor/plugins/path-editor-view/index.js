// import { Editor } from "elf/editor/manager/Editor";
import PathEditorView from "./PathEditorView";
import PathManager from "./PathManager";
// import PathSegmentView from './PathSegmentView';

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    PathEditorView,
    // PathSegmentView
  });

  editor.registerUI("page.subeditor.view", {
    PathManager,
  });
}
