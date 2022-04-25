// import { Editor } from "elf/editor/manager/Editor";
import DefaultLayoutItemProperty from "./DefaultLayoutItemProperty";
import FlexGrowToolView from "./FlexGrowToolView";
import FlexLayoutEditor from "./FlexLayoutEditor";
// import FlexLayoutItemProperty from "./FlexLayoutItemProperty";
import GridBoxEditor from "./GridBoxEditor";
import GridGapEditor from "./GridGapEditor";
import GridGrowToolView from "./GridGrowToolView";
import GridLayoutEditor from "./GridLayoutEditor";
// import GridLayoutItemProperty from "./GridLayoutItemProperty";
import LayoutProperty from "./LayoutProperty";
import ResizingItemProperty from "./ResizingItemProperty";
import ResizingProperty from "./ResizingProperty";

import { CanvasViewToolLevel } from "elf/editor/types/editor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    FlexLayoutEditor,
    GridLayoutEditor,
    GridBoxEditor,
    GridGapEditor,
  });

  editor.registerUI("inspector.tab.style", {
    LayoutProperty,
    ResizingProperty,
    ResizingItemProperty,
    DefaultLayoutItemProperty,
    // GridLayoutItemProperty,
    // FlexLayoutItemProperty,
  });

  editor.registerUI(
    "canvas.view",
    {
      FlexGrowToolView,
      GridGrowToolView,
    },
    CanvasViewToolLevel.LAYOUT_TOOL
  );
}
