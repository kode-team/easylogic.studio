import { EditingMode } from "elf/editor/types/editor";

export default {
  key: "editing.mode",
  defaultValue: EditingMode.SELECT,
  title: "set editing mode for Editor",
  description: "set editing mode (select, append, draw, path)",
  type: "string",
};
