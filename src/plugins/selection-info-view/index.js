import SelectionInfoView from "./SelectionInfoView";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    SelectionInfoView,
  });
}
