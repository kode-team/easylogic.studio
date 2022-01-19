import { isFunction } from "el/sapa/functions/func";
import icon from "el/editor/icon/icon";

export class ClipboardManager {
    constructor (editor) {
        this.editor = editor;
        this.clipboard = [];
    }

    get length () {
        return this.clipboard.length;
    }

    clear () {
        this.clipboard = [];
    }

    get isEmpty () {
        return this.clipboard.length == 0;
    }

    push (data) {
        this.clipboard.push(data);
    }

    pop() {
        return this.clipboard.pop();
    }

}