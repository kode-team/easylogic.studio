import UIElement, { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";
import "@ui/property";
import "@ui/property-editor";
import { DEBOUNCE } from "@sapa/Event";


export default class LibraryItems extends UIElement {

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

  [EVENT('onTextChange') + DEBOUNCE(300)] (key, value) {
    this.broadcast('search', value);
  }
}

registElement({ LibraryItems })
