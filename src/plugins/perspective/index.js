import { Editor } from "el/editor/manager/Editor";
import PerspectiveProperty from "./PerspectiveProperty";



/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        PerspectiveProperty
    })
}