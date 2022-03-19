import { Editor } from "el/editor/manager/Editor";
import PerspectiveProperty from "./PerspectiveProperty";



/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('inspector.tab.style', {
        PerspectiveProperty
    })
}