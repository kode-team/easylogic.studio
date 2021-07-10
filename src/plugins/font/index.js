import { Editor } from "el/editor/manager/Editor";
import FontProperty from "./FontProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.text', {
        FontProperty
    })
}