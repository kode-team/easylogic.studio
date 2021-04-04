import { Editor } from "el/editor/manager/Editor";
import { ReactComponentLayer } from "./ReactComponentLayer";
import { ReactComponentLayerInspector } from "./ReactComponentLayerInspector";
import { REACT_COMPONENT_TYPE } from "./constants";
import ReactComponentHTMLRender from "./ReactComponentHTMLRender";
import AddReactComponent from "./AddReactComponent";


/**
 * 
 * initialize ReactComponent Plugin 
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    // register item layer 
    editor.registerItem(REACT_COMPONENT_TYPE, ReactComponentLayer )    

    // register inspector editor 
    editor.registerInspector(REACT_COMPONENT_TYPE, ReactComponentLayerInspector)

    // register html renderer 
    editor.registerRenderer('html', REACT_COMPONENT_TYPE, new ReactComponentHTMLRender() )    

    // register control ui 
    editor.registerElement({ 
        AddReactComponent,
    })
}
