import { Editor } from "el/editor/manager/Editor";
import BackgroundImageProperty from "./BackgroundImageProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        BackgroundImageProperty
    })
}