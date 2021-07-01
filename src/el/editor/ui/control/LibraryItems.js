import { registElement } from "el/base/registElement";
import "el/editor/ui/property";
import "el/editor/ui/property-editor";
import { DEBOUNCE, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "../common/EditorElement";


export default class LibraryItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='library-items'>
        <div>
          <object label="Search" refClass="TextEditor" key="search" onchange="onTextChange" />
        </div>
        ${this.$menuManager.getTargetMenuItems('library').map(it => {
          return /*html*/`<object refClass="${it.refClass}" />`
        }).join('\n')}
      </div>
    `;
  }

  [SUBSCRIBE('onTextChange') + DEBOUNCE(300)] (key, value) {
    this.broadcast('search', value);
  }
}

registElement({ LibraryItems })
