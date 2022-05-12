import { ClipboardActionType } from "elf/editor/types/editor";

export default {
  command: "clipboard.copy",
  title: "Copy",
  description: "Copy",
  execute: function (editor) {
    editor.context.clipboard.push({
      type: ClipboardActionType.COPY,
      data: editor.context.selection.ids,
    });
  },
};
