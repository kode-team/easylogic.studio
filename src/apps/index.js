import { start } from "sapa";

import "../scss/index.scss";
import BlankEditor from "./blankeditor";
import DataEditor from "./dataeditor";
import DesignEditor from "./designeditor";
import ThreeEditor from "./three-editor";
import WhiteBoard from "./whiteboard";
export * from "export-library/index";

export function createDesignEditor(opts) {
  return start(DesignEditor, opts);
}

export function createThreeEditor(opts) {
  return start(ThreeEditor, opts);
}

export function createBlankEditor(opts) {
  return start(BlankEditor, opts);
}

export function createDataEditor(opts) {
  return start(DataEditor, opts);
}

// createPageBuilder (opts = {}) {
//   return App.start(PageBuilder as any, opts)
// },
export function createWhiteBoard(opts) {
  return start(WhiteBoard, opts);
}
