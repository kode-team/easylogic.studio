import { Editor } from "el/editor/manager/Editor";
/**
 * 
 * @param {Editor} editor 
 * @param {any[]} args 
 */
export default {
    command: 'Console',
    description: "do console.log()",
    execute: (editor, ...args) => {
        console.log(...args);
    }
}