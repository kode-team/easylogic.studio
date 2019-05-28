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
      this.refs.$preview.text(current.toExport().replace(/;/gi, ";\n") + ";");
      // console.log(current.toKeyframeString())
    }
  }

  refresh() {
    this.loadCode();
  }

  [EVENT("refreshCanvas")]() {
    this.refresh();
  }
}
