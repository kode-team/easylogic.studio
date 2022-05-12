import VideoProperty from "./VideoProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    VideoProperty,
  });
}
