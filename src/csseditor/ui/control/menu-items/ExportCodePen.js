import { SUBMIT, PREVENT } from "../../../../util/Event";
import UIElement from "../../../../util/UIElement";

import ExportManager from "../../../../editor/ExportManager";
 
export default class ExportCodePen extends UIElement {
  template() {
    return `
    <form class='codepen' action="https://codepen.io/pen/define" method="POST" target="_code_pen">
      <input type="hidden" name="data" ref="$codepen" value=''>
      <button type="submit">
        <div class='icon codepen'></div>
        <div class='title'>CodePen</div>
      </button>
    </form>     
    `;
  }

  [SUBMIT()]() {
    var obj = ExportManager.generate();
    console.log(obj)
    this.refs.$codepen.val(JSON.stringify(obj))

    return false;
  }

}
