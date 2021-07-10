import { Editor } from "el/editor/manager/Editor";
import PatternAssetsProperty from "./PatternAssetsProperty";
import PatternEditor from "./PatternEditor";
import PatternInfoPopup from "./PatternInfoPopup";
import PatternProperty from "./PatternProperty";
import PatternSizeEditor from "./PatternSizeEditor";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        PatternEditor,
        PatternSizeEditor,
        PatternAssetsProperty
    })


    editor.registerMenuItem('inspector.tab.style', {
        PatternProperty,
    })

    editor.registerMenuItem('popup', {
        PatternInfoPopup
    })
}