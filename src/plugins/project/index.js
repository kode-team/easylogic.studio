import { Editor } from "el/editor/manager/Editor";
import ProjectProperty from "./ProjectProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        ProjectProperty
    })
}