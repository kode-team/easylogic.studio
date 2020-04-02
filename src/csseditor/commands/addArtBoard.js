import _refreshSelection from "./_refreshSelection";
import { Length } from "../../editor/unit/Length";

export default function addArtBoard (editor, obj = {}) {

    var project = editor.selection.currentProject;
    if (!project) {
        project = editor.add(editor.components.createComponent('project'))

        editor.selection.selectProject(project);
    }

    var artboard = project.add(editor.components.createComponent('artboard', {
        x: Length.px(300),
        y: Length.px(200),
        width: Length.px(375),
        height: Length.px(667),
        ...obj
    }))

    editor.selection.selectArtboard(artboard);
    editor.selection.select(artboard);

    _refreshSelection(editor)

}