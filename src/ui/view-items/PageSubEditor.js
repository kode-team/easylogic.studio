import UIElement from "@sapa/UIElement";

import "./PathManager";
import "./DrawManager";
import { registElement } from "@sapa/registerElement";

export default class PageSubEditor extends UIElement {

  template() {
    return/*html*/`
      <div class='page-subeditor'>
        <object refClass='PathManager' />
        <object refClass='DrawManager' />
        <object refClass='SelectionManager' />
      </div>
    `;
  }
}

registElement({ PageSubEditor })
