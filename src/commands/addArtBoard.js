import _doForceRefreshSelection from "./_doForceRefreshSelection";
import { Length } from "@unit/Length";
import { Editor } from "@manager/Editor";
/**
 * 
 * @param {Editor} editor 
 * @param {*} obj 
 */
export default function addArtBoard (editor, obj = {}) {

    var project = editor.selection.currentProject;
    if (!project) {
        project = editor.add(editor.createItem({ itemType: 'project' }))

        editor.selection.selectProject(project);
    }

    var artboard = project.add(editor.createItem({
        itemType: 'artboard',
        x: Length.px(300),
        y: Length.px(200),
        width: Length.px(375),
        height: Length.px(667),
        ...obj
    }))

    editor.selection.select(artboard);

    _doForceRefreshSelection(editor)

}