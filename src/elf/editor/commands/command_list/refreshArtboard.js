import {
  REFRESH_SELECTION,
  REFRESH_SELECTION_TOOL,
  UPDATE_CANVAS,
} from "../../types/event";
export default {
  command: "refreshArtboard",
  execute: function (editor) {
    const command = editor.createCommandMaker();

    command.emit("refreshLayerTreeView");
    command.emit("refreshAllCanvas");
    command.emit("refreshStyleView");
    command.emit(UPDATE_CANVAS);
    command.emit("refreshAllElementBoundSize");
    command.emit(REFRESH_SELECTION);

    command.run();

    editor.nextTick(() => {
      editor.emit(REFRESH_SELECTION_TOOL);
    });
  },
};
