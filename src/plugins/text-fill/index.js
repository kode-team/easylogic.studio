import { Editor } from "el/editor/manager/Editor";
import TextFillProperty from "./TextFillProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        TextFillProperty
    })
}