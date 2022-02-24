import { Editor } from "el/editor/manager/Editor";
import BoxShadowProperty from "./BoxShadowProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerMenuItem('inspector.tab.style', {
        BoxShadowProperty
    })
}