import { Editor } from "el/editor/manager/Editor";
import PathToolProperty from "./PathToolProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        PathToolProperty
    })
}