import { SUBMIT } from "../../../../util/Event";
import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import UIElement from "../../../../util/UIElement";

export default class ExportCodePen extends UIElement {
  template() {
    return `
            <form class='codepen' action="https://codepen.io/pen/define" method="POST" target="_code_pen">
                <input type="hidden" name="data" ref="$codepen" value=''>
                <button type="submit">
                    <div class='icon codepen'></div>
                    <div class='titie'>CodePen</div>
                </button>
            </form>     
        `;
  }

  [SUBMIT()]() {
    var current = editor.selection.current;
    if (current) {
      this.refs.$codepen.val(
        JSON.stringify({
          html: '<div id="sample"></div>',
          css: `#sample { 
              width: 300px;
              height:300px; 
              ${current.toString().replace(/;/gi, ";\n")}; } `
        })
      );
    }

    return false;
  }
}
