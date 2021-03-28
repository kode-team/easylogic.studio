import UIElement, { EVENT } from "el/base/UIElement";
import { registElement } from "el/base/registerElement";
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
        <object refClass="FeatherIconsProperty" ref="$feather" />
        <object refClass="PrimerOctIconsProperty" ref="$primer" />
        <object refClass="AntDesignIconsProperty" ref="$antdesign" />
      </div>
    `;
  }

  [SUBSCRIBE('onTextChange') + DEBOUNCE(300)] (key, value) {
    this.broadcast('search', value);
  }
}

registElement({ LibraryItems })
