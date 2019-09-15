import { SUBMIT } from "../../../util/Event";
import MenuItem from "./MenuItem";

import ExportManager from "../../../editor/ExportManager";

export default class ExportJSFiddle extends MenuItem {
  template() {
    return /*html*/`
      <form class='jsfiddle' action="https://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank">
          <input type="hidden" name="title" ref="$title" value=''>
          <input type="hidden" name="description" ref="$description" value=''>
          <input type="hidden" name="html" ref="$html" value=''>
          <input type="hidden" name="css" ref="$css" value=''>
          <input type="hidden" name="dtd" value='html 5'>
          <input type="hidden" name="resources" ref='$resources' value="" />
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
    var js_external = [
      'https://cdn.jsdelivr.net/npm/@easylogic/anipa@0.0.3/dist/main.js'
    ].join(',');

    this.refs.$html.val(obj.html);
    this.refs.$css.val(obj.css);
    this.refs.$resources.val(js_external)

    return false;
  }
}
