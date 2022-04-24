import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./PageSubEditor.scss";

export default class PageSubEditor extends EditorElement {
  template() {
    return /*html*/ `
      <div class='elf--page-subeditor'>
        ${this.$injectManager.generate("page.subeditor.view")}         
      </div>
    `;
  }
}
