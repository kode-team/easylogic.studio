import { DEBOUNCE, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";


export default class LibraryItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='library-items'>
        <div>
          <object label="Search" refClass="TextEditor" key="search" onchange="onTextChange" />
        </div>
        ${this.$menuManager.generate('library')}
      </div>
    `;
  }

  [SUBSCRIBE('onTextChange') + DEBOUNCE(300)] (key, value) {
    this.broadcast('search', value);
  }
}