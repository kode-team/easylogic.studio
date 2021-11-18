import { Editor } from "el/editor/manager/Editor";
import ComponentProperty from "./ComponentProperty";
import ComponentPopup from './ComponentPopup';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        ComponentProperty,
    })

    editor.registerMenuItem('popup', {
        ComponentPopup
    })
}