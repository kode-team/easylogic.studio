import { Editor } from "el/editor/manager/Editor";
import TransformProperty from "./TransformProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        TransformProperty
    })
}