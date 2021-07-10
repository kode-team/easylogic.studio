import { Editor } from "el/editor/manager/Editor";
import TransitionProperty from "./TransitionProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        TransitionProperty
    })
}