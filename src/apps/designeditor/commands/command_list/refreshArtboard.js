import { REFRESH_SELECTION, UPDATE_CANVAS } from "elf/editor/types/event";

export default {
  command: "refreshArtboard",
  execute: function (editor) {
    const command = editor.createCommandMaker();

    command.emit("refreshLayerTreeView");
    command.emit("refreshAllCanvas");
    command.emit(UPDATE_CANVAS);
    command.emit("refreshAllElementBoundSize");
    command.emit(REFRESH_SELECTION);

    command.run();
  },
};
