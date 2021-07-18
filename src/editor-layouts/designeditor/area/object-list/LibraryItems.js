import { DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './LibraryItems.scss';

export default class LibraryItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='elf--library-items'>
        <div>
          <object label="Search" refClass="TextEditor" key="search" onchange="onTextChange" />
        </div>
        ${this.$menuManager.generate('library')}
      </div>
    `;
  }

  [SUBSCRIBE_SELF('onTextChange') + DEBOUNCE(300)] (key, value) {
    this.broadcast('search', value);
  }
}