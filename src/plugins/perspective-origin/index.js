import { Editor } from "el/editor/manager/Editor";
import PerspectiveOriginEditor from "./PerspectiveOriginEditor";
import PerspectiveOriginProperty from "./PerspectiveOriginProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        PerspectiveOriginEditor,
    });

    editor.registerMenuItem('inspector.tab.style', {
        PerspectiveOriginProperty
    });
}