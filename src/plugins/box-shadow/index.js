import { Editor } from "el/editor/manager/Editor";
import BoxShadowEditor from "./BoxShadowEditor";
import BoxShadowProperty from "./BoxShadowProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        BoxShadowEditor
    })

    editor.registerMenuItem('inspector.tab.style', {
        BoxShadowProperty
    })
}