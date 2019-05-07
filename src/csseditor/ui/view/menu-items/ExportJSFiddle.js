import { SUBMIT } from "../../../../util/Event";
import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";

export default class ExportJSFiddle extends MenuItem {
  template() {
    return `
            <form class='jsfiddle' action="http://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank">
                <input type="hidden" name="title" ref="$title" value=''>
                <input type="hidden" name="description" ref="$description" value=''>
                <input type="hidden" name="html" ref="$html" value=''>
                <input type="hidden" name="css" ref="$css" value=''>
                <input type="hidden" name="dtd" value='html 5'>
                <button type="submit">
                    <div class='icon jsfiddle'></div>
                    <div class='titie'>JSFiddle</div>
                </button>                
            </form>     
        `;
  }

  [SUBMIT()]() {
    var current = editor.selection.current;
    if (current) {
      this.refs.$title.val("Gradient - easylogic.studio");
      this.refs.$description.val("https://gradient.easylogic.studio");
      this.refs.$html.val('<div id="sample"></div>');
      this.refs.$css.val(
        `#sample { width:300px;height:300px; ${current.toExport()}; } `
      );
    }

    return false;
  }
}
