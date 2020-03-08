import _refreshSelection from "./_refreshSelection";

export default function addArtBoard (editor, obj = {}) {

    var project = editor.selection.currentProject;
    if (!project) {
        project = editor.add(editor.createComponent('project'))

        editor.selection.selectProject(project);
    }

    var artboard = project.add(editor.createComponent('artboard', {
        x: Length.px(300),
        y: Length.px(300),
        width: Length.px(300),
        height: Length.px(600),
        ...obj
    }))

    editor.selection.selectArtboard(artboard);
    editor.selection.select(artboard);

    _refreshSelection(editor)

}