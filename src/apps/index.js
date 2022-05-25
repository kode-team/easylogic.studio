import { start } from "sapa";

import "../scss/index.scss";
import { BlankEditor } from "./blankeditor";
import { DesignEditor } from "./designeditor";
export * from "export-library/index";

export function createDesignEditor(opts) {
  return start(DesignEditor, opts);
}

export function createBlankEditor(opts) {
  return start(BlankEditor, opts);
}
