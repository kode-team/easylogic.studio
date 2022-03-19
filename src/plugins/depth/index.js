import { Editor } from "el/editor/manager/Editor";
import DepthProperty from "./DepthProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('inspector.tab.style', {
        DepthProperty
    })
}