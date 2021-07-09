import { Editor } from "el/editor/manager/Editor";
import FontSpacingProperty from "./FontSpacingProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        FontSpacingProperty
    })
}