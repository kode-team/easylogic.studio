import { Editor } from "el/editor/manager/Editor";
import PerspectiveProperty from "./PerspectiveProperty";



/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        PerspectiveProperty
    })
}