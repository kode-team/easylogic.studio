// import { Editor } from "elf/editor/manager/Editor";
import GhostToolView from "./GhostToolView";
import GroupSelectionToolView from "./GroupSelectionToolView";
import SelectionToolView from "./SelectionToolView";

import { CanvasViewToolLevel } from "elf/editor/types/editor";

/**
 *
 * @param {Editor} editor
 */
export default async function (editor) {
  editor.registerUI(
    "canvas.view",
    {
      GhostToolView,
      SelectionToolView,
      GroupSelectionToolView,
    },
    CanvasViewToolLevel.SELECTION_TOOL
  );
}
