import { Editor } from "el/editor/manager/Editor";
import TransitionProperty from "./TransitionProperty";
import TransitionPropertyPopup from "./TransitionPropertyPopup";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.transition', {
        TransitionProperty
    })

    editor.registerMenuItem('popup', {
        TransitionPropertyPopup
    })
}