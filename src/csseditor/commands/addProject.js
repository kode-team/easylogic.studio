import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default function addProject (editor, obj = {}) {
    var project = editor.add(editor.components.createComponent('project', {
        ...obj
    }))

    editor.selection.selectProject(project);
    _doForceRefreshSelection(editor)
}