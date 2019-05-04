import UIElement from "../../../../util/UIElement";
import { SUBMIT } from "../../../../util/Event";

export default class ExportJSFiddleButton extends UIElement {

    template () { 
        return `
            <form class='jsfiddle' action="http://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank">
                <input type="hidden" name="title" ref="$title" value=''>
                <input type="hidden" name="description" ref="$description" value=''>
                <input type="hidden" name="html" ref="$html" value=''>
                <input type="hidden" name="css" ref="$css" value=''>
                <input type="hidden" name="dtd" value='html 5'>
                <button type="submit">JSFiddle</button>
            </form>     
        `
    }

    [SUBMIT()] () {
        var generateCode = this.read('export/generate/code');

        this.refs.$title.val('CSS Gradient Editor')
        this.refs.$description.val('EasyLogic Studio - https://css.easylogic.studio')
        this.refs.$html.val(generateCode.html)
        this.refs.$css.val(generateCode.css)

        return false; 
    }


} 