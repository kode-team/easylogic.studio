import { Editor } from "el/editor/manager/Editor";
import ComponentProperty from "./ComponentProperty";
import ComponentPopup from './ComponentPopup';
import ComponentEditor from './ComponentEditor';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        ComponentEditor
    })

    editor.registerMenuItem('inspector.tab.style', {
        ComponentProperty,
    })

    editor.registerMenuItem('popup', {
        ComponentPopup
    })
}