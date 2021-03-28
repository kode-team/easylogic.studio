import { Editor } from "el/editor/manager/Editor";
import AddSimplePlugin from "./AddSimplePlugin";
import SimpleEditor from "./SimpleEditor";
import SimpleHTMLRender from "./SimpleHTMLRender";
import SimpleLayer from "./SimpleLayer";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({ 
        AddSimplePlugin,
        SimpleEditor
    })
    editor.registerComponent('simple', SimpleLayer )
    editor.registerRenderer('html', 'simple', new SimpleHTMLRender() )

}

