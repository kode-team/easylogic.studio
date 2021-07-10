import { Editor } from "el/editor/manager/Editor";
import ClipPathPopup from "./ClipPathPopup";
import ClipPathProperty from "./ClipPathProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        ClipPathProperty
    })

    editor.registerMenuItem('popup', {
        ClipPathPopup
    })
}