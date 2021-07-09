import { Editor } from "el/editor/manager/Editor";
import AppearanceProperty from "./AppearanceProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        AppearanceProperty
    })
}