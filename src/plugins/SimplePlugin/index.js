import { Editor } from "@manager/Editor";
import AddSimplePlugin from "./AddSimplePlugin";
import SimpleHTMLRender from "./SimpleHTMLRender";
import SimpleLayer from "./SimpleLayer";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({ 
        AddSimplePlugin
    })
    editor.registerComponent('simple', SimpleLayer )
    editor.registerRenderer('html', 'simple', new SimpleHTMLRender() )

}

