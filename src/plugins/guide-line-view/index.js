import { Editor } from "el/editor/manager/Editor";
import GuideLineView from './GuideLineView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        GuideLineView         
    })
}