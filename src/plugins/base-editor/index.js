import { Editor } from "el/editor/manager/Editor";
import Button from './Button';
import ToggleCheckBox from './ToggleCheckBox';

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        ToggleCheckBox,
        Button,
    });
}