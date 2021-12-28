import { Editor } from "el/editor/manager/Editor";
import configs from "./configs";



/**
 * register i18n default messages 
 * 
 * @param {Editor} editor
 */
export default function (editor: Editor): void {

    configs.forEach(config => {
        editor.registerConfig(config);
    });

}