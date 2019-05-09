import UIElement, { EVENT } from "../../../util/UIElement";
import { editor } from "../../../editor/editor";

export default class ExportWindow extends UIElement {
  template() {
    return `
            <div class='export-view'>
              <div class="codeview">
                <textarea ref='$preview'></textarea>
              </div>
            </div>
        `;
  }

  loadCode() {
    var current = editor.selection.current;
    if (current) {
      this.refs.$preview.val(current.toString().replace(/;/gi, ";\n") + ";");
    }
  }

  refresh() {
    this.loadCode();
  }

  [EVENT("refreshCanvas")]() {
    this.refresh();
  }
}
