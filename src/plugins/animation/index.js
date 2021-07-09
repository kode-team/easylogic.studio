import { Editor } from "el/editor/manager/Editor";
import AnimationProperty from "./AnimationProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        AnimationProperty
    })
}