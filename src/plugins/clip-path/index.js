import { Editor } from "el/editor/manager/Editor";
import ClipPathProperty from "./ClipPathProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('inspector.tab.style', {
        ClipPathProperty
    })
}