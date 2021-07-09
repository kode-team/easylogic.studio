import { Editor } from "el/editor/manager/Editor";
import BorderRadiusProperty from "./BorderRadiusProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        BorderRadiusProperty
    })
}