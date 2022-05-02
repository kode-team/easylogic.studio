import { CHANGE_ICON_VIEW } from "../../types/event";

export default {
  command: "refreshCursor",
  execute: function (editor, iconType, ...args) {
    editor.emit(CHANGE_ICON_VIEW, iconType, ...args);
  },
};
