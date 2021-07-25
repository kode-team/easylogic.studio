import { Editor } from "el/editor/manager/Editor";
import SVGTextProperty from "./SVGTextProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        SVGTextProperty
    })
}