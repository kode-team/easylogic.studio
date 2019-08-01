import { SUBMIT } from "../../../util/Event";
import MenuItem from "./MenuItem";

import ExportManager from "../../../editor/ExportManager";

export default class ExportJSFiddle extends MenuItem {
  template() {
    return `
      <form class='jsfiddle' action="https://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank">
          <input type="hidden" name="title" ref="$title" value=''>
          <input type="hidden" name="description" ref="$description" value=''>
          <input type="hidden" name="html" ref="$html" value=''>
          <input type="hidden" name="css" ref="$css" value=''>
          <input type="hidden" name="dtd" value='html 5'>
          <button type="submit">
              <div class='icon jsfiddle'></div>
              <div class='title'>JSFiddle</div>
          </button>                
      </form>     
    `;
  }

  [SUBMIT()]() {
    this.refs.$title.val("sapa - editor.easylogic.studio");
    this.refs.$description.val("https://editor.easylogic.studio");

    var obj = ExportManager.generate();

    this.refs.$html.val(obj.html);
    this.refs.$css.val(obj.css);

    return false;
  }
}
