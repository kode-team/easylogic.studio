import { Editor } from "el/editor/manager/Editor";
import ImageProperty from "./ImageProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        ImageProperty
    })
}