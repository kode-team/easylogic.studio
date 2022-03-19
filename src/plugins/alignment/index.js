import { Editor } from "el/editor/manager/Editor";
import AlignmentProperty from "./AlignmentProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('inspector.tab.style', {
        AlignmentProperty  
    })
}