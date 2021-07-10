import { Editor } from "el/editor/manager/Editor";
import BackgroundClipProperty from "./BackgroundClipProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        BackgroundClipProperty
    })
}