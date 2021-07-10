import { Editor } from "el/editor/manager/Editor";
import TransformOriginProperty from "./TransformOriginProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        TransformOriginProperty
    })
}