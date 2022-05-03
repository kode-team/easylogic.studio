// import { Editor } from "elf/editor/manager/Editor";

/**
 *
 * @param {Editor} editor
 * @param {*} callback
 */
export default function _currentProject(editor, callback) {
  var project = editor.context.selection.currentProject;

  if (project) {
    var timeline = project.getSelectedTimeline();

    callback && callback(project, timeline);
  }
}
