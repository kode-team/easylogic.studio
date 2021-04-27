import { Editor } from "el/editor/manager/Editor";
import AddSimplePlugin from "./AddSimplePlugin";
import { SIMPLE_TYPE } from "./constants";
import SimpleEditor from "./SimpleEditor";
import SimpleHTMLRender from "./SimpleHTMLRender";
import SimpleLayer from "./SimpleLayer";
import { SimpleLayerInspector } from "./SimpleLayerInspector";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    // register item layer 
    editor.registerItem(SIMPLE_TYPE, SimpleLayer )

    // register inspector editor 
    editor.registerInspector(SIMPLE_TYPE, SimpleLayerInspector)

    // register html renderer
    editor.registerRenderer('html', SIMPLE_TYPE, new SimpleHTMLRender() )

    // register control ui 
    editor.registElement({ 
        AddSimplePlugin,
        SimpleEditor
    })


}

