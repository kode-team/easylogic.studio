import { Editor } from "el/editor/manager/Editor";
import PerspectiveOriginProperty from "./PerspectiveOriginProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        PerspectiveOriginProperty
    })
}