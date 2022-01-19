import { Editor } from "el/editor/manager/Editor";
import AlignmentProperty from "./AlignmentProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        AlignmentProperty  
    })
}