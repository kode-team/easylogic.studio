import { Editor } from "el/editor/manager/Editor";
import SelectorPopup from "./SelectorPopup";
import SelectorProperty from "./SelectorProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.transition', {
        SelectorProperty   
    })

    editor.registerMenuItem('popup', {
        SelectorPopup
    })
}