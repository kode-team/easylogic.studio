import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK } from "../../../util/Event";
import ExportCodePenButton from "../view/export/ExportCodPenButton";
import ExportJSFiddleButton from "../view/export/ExportJSFiddleButton";
import { SELECTION_CURRENT_PAGE } from "../../types/SelectionTypes";
import { EMPTY_STRING } from "../../../util/css/types";
import { EXPORT_GENERATE_CODE } from "../../types/ExportTpyes";
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
      this.refs.$preview.html(current.toString().replace(/;/gi, ";\n"));
    }
  }

  refresh() {
    this.loadCode();
  }

  [EVENT("refreshCanvas")]() {
    this.refresh();
  }
}
