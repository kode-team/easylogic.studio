import _refreshSelection from "./_refreshSelection";

export default function addProject (editor, obj = {}) {
    var project = editor.add(editor.createComponent('project', {
        ...obj
    }))

    editor.selection.selectProject(project);
    _refreshSelection(editor)
}