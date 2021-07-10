import { Editor } from "el/editor/manager/Editor";
import CodeViewProperty from "./CodeViewProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.code', {
        CodeViewProperty
    })
}