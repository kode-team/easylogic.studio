import { Editor } from "el/editor/manager/Editor";
import AnimationProperty from "./AnimationProperty";
import AnimationPropertyPopup from "./AnimationPropertyPopup";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.transition', {
        AnimationProperty
    });

    editor.registerMenuItem('popup', {
        AnimationPropertyPopup
    })
}