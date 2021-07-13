import { Editor } from "el/editor/manager/Editor";
import TimelineProperty from "./TimelineProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        TimelineProperty
    })
}