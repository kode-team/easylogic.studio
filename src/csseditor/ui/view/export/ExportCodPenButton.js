import UIElement from "../../../../util/UIElement";
import { SUBMIT } from "../../../../util/Event";

export default class ExportCodePenButton extends UIElement {

    template () { 
        return `
            <form class='codepen' action="https://codepen.io/pen/define" method="POST" target="_blank">
                <input type="hidden" name="data" ref="$codepen" value=''>
                <button type="submit">CodePen</button>
            </form>     
        `
    }

    [SUBMIT()] () {
        var generateCode = this.read('export/generate/code');
        this.refs.$codepen.val(this.read('export/codepen/code', {
            html: generateCode.html, 
            css: generateCode.css 
        }))

        return false; 
    }


} 