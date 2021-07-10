import { Editor } from "el/editor/manager/Editor";
import BorderRadiusEditor from "./BorderRadiusEditor";
import BorderRadiusProperty from "./BorderRadiusProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        BorderRadiusEditor,
    });

    editor.registerMenuItem('inspector.tab.style', {
        BorderRadiusProperty
    });
}