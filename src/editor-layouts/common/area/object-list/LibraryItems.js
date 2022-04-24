import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { createComponent } from "sapa";

import "./LibraryItems.scss";

export default class LibraryItems extends EditorElement {
  template() {
    return /*html*/ `
      <div class='elf--library-items'>
        <div>
          ${createComponent("TextEditor", {
            label: "Search",
            key: "search",
            onchange: this.subscribe((key, value) => {
              this.broadcast("search", value);
            }, 300),
          })}
        </div>
        ${this.$injectManager.generate("library")}
      </div>
    `;
  }
}
