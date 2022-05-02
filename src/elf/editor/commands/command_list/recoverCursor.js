import { CHANGE_ICON_VIEW } from "../../types/event";

export default {
  command: "recoverCursor",
  execute: function (editor) {
    editor.emit(CHANGE_ICON_VIEW, "auto");
  },
};
