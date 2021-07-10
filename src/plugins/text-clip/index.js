import { Editor } from "el/editor/manager/Editor";
import TextClipProperty from "./TextClipProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        TextClipProperty
    })
}