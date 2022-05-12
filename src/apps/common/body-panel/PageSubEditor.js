import "./PageSubEditor.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class PageSubEditor extends EditorElement {
  template() {
    return /*html*/ `
      <div class='elf--page-subeditor'>
        ${this.$injectManager.generate("page.subeditor.view")}         
      </div>
    `;
  }
}
