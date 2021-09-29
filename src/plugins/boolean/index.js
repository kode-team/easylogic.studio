import { Editor } from "el/editor/manager/Editor";
import BooleanProperty from "./BooleanProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        BooleanProperty
    })
}