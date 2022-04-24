import { start } from "sapa";
import "../scss/index.scss";
import DesignEditor from "./designeditor";
import ThreeEditor from "./three-editor";
import BlankEditor from "./blankeditor";
import WhiteBoard from "./whiteboard";
import DataEditor from "./dataeditor";
export * from "export-library/index";

function createDesignEditor(opts) {
  return start(DesignEditor, opts);
}

function createThreeEditor(opts) {
  return start(ThreeEditor, opts);
}

function createBlankEditor(opts) {
  return start(BlankEditor, opts);
}

function createDataEditor(opts) {
  return start(DataEditor, opts);
}

// createPageBuilder (opts = {}) {
//   return App.start(PageBuilder as any, opts)
// },
function createWhiteBoard(opts) {
  return start(WhiteBoard, opts);
}

export {
  createDesignEditor,
  createThreeEditor,
  createDataEditor,
  createWhiteBoard,
  createBlankEditor,
};
