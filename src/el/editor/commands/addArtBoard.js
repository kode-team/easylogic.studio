import _doForceRefreshSelection from "./_doForceRefreshSelection";
import { Length } from "el/editor/unit/Length";
import { Editor } from "el/editor/manager/Editor";
/**
 * 
 * @param {Editor} editor 
 * @param {*} obj 
 * @param {vec3} [center=null] center를 지정하고 artboard 를 재배치 
 */
export default function addArtBoard (editor, obj = {}, center = null) {

    var project = editor.selection.currentProject;
    if (!project) {
        project = editor.add(editor.createItem({ itemType: 'project' }))

        editor.selection.selectProject(project);
    }

    var artboard = project.appendChildItem(editor.createItem({
        itemType: 'artboard',
        x: Length.px(300),
        y: Length.px(200),
        width: Length.px(375),
        height: Length.px(667),
        ...obj
    }))

    if (center) {
        artboard.reset({
            x: Length.px(0),
            y: Length.px(0),
        })
        artboard.moveByCenter(center);
    }

    editor.selection.select(artboard);

    _doForceRefreshSelection(editor)

}