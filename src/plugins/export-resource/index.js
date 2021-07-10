import { Editor } from "el/editor/manager/Editor";
import ExportProperty from "./ExportProperty";




/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        ExportProperty
    })
}