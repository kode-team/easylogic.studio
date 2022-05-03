import { EditingMode } from "../../types/editor";
import { REFRESH_SELECTION_TOOL } from "../../types/event";

/**
 * 객체 추가 모드로 변경
 *
 * @param {*} editor
 * @param {*} type
 */

export default {
  command: "addLayerView",
  execute: async function (editor, type, data = {}) {
    // editor.emit('hideSubEditor');
    editor.context.selection.empty();
    await editor.emit(REFRESH_SELECTION_TOOL);
    await editor.emit("hideAddViewLayer");
    await editor.emit("removeGuideLine");

    editor.context.config.set("editing.mode.itemType", type);

    if (type === "select") {
      // NOOP
      // select 는 아무것도 하지 않는다.
      editor.context.config.set("editing.mode", EditingMode.SELECT);
    } else if (type === "brush") {
      editor.context.config.set("editing.mode", EditingMode.DRAW);
      await editor.emit("showPathDrawEditor");
    } else if (type === "path") {
      editor.context.config.set("editing.mode", EditingMode.PATH);
      await editor.emit("showPathEditor", "path");
    } else {
      editor.context.config.set("editing.mode", EditingMode.APPEND);
      await editor.emit("showLayerAppendView", type, data);
    }
  },
};
