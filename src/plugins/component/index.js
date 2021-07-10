import { Editor } from "el/editor/manager/Editor";
import ComponentProperty from "./ComponentProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        ComponentProperty
    })
}