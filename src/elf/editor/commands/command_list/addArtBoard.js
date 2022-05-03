import _doForceRefreshSelection from "./_doForceRefreshSelection";
// import { Editor } from "elf/editor/manager/Editor";
/**
 *
 * @param {Editor} editor
 * @param {*} obj
 * @param {vec3} [center=null] center를 지정하고 artboard 를 재배치
 */
export default {
  command: "AddArtBoard",
  execute: (editor, obj = {}, center = null) => {
    var project = editor.context.selection.currentProject;
    if (!project) {
      project = editor.add(editor.createModel({ itemType: "project" }));

      editor.context.selection.selectProject(project);
    }

    var artboard = project.appendChild(
      editor.createModel({
        itemType: "artboard",
        x: 300,
        y: 200,
        width: 375,
        height: 667,
        ...obj,
      })
    );

    if (center) {
      artboard.reset({
        x: 0,
        y: 0,
      });
      artboard.moveByCenter(center);
    }

    editor.context.selection.select(artboard);

    _doForceRefreshSelection(editor);
  },
};
