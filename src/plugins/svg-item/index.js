import { Editor } from "el/editor/manager/Editor";
import SVGItemProperty from "./SVGItemProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        SVGItemProperty
    })
}