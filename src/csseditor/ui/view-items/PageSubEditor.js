import UIElement from "../../../util/UIElement";

import PathManager from "./PathManager";


export default class PageSubEditor extends UIElement {

  components() {
    return {
      PathManager
    }
  }

  template() {
    return/*html*/`
      <div class='page-subeditor'>
        <PathManager />
        <SelectionManager />
      </div>
    `;
  }
}
