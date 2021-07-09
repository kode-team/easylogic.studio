import { Editor } from "el/editor/manager/Editor";
import KeyframeProperty from "./KeyframeProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        KeyframeProperty
    })
}