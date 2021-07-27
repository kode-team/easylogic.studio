import { EditorElement } from "el/editor/ui/common/EditorElement";

import './LibraryItems.scss';

export default class LibraryItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='elf--library-items'>
        <div>
          <object label="Search" refClass="TextEditor" key="search" onchange=${this.subscribe((key, value) => {
            this.broadcast('search', value);
          }, 300)} />
        </div>
        ${this.$menuManager.generate('library')}
      </div>
    `;
  }
}