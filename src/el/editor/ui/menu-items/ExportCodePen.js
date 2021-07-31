import { SUBMIT } from "el/sapa/Event";
import { registElement } from "el/sapa/functions/registElement";

import ExportManager from "el/editor/manager/ExportManager";
import { EditorElement } from "../common/EditorElement";

 
export default class ExportCodePen extends EditorElement {
  template() {
    return /*html*/`
    <form class='codepen' action="https://codepen.io/pen/define" method="POST" target="_code_pen">
      <input type="hidden" name="data" ref="$codepen" value=''>
      <button type="submit">
        <div class='icon codepen'></div>
        <div class='title'>${this.$i18n('menu.item.codepen.title')}</div>
      </button>
    </form>     
    `;
  }

  [SUBMIT()]() {
    var obj = ExportManager.generate(this.$editor);
    this.refs.$codepen.val(JSON.stringify({
      title: "sapa - editor.easylogic.studio",
      description: "https://editor.easylogic.studio",
      js_external: "https://cdn.jsdelivr.net/npm/@easylogic/anipa@0.0.11/dist/main.js",
      ...obj
    }))

    return false;
  }

}

registElement({ ExportCodePen })