import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default function addProject(editor, obj = {}) {
  var project = editor.createModel({
    itemType: "project",
    ...obj,
  });

  editor.context.selection.selectProject(project);
  _doForceRefreshSelection(editor);
}
