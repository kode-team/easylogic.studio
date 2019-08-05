import UIElement from "../../../util/UIElement";

import StarManager from "./StarManager";
import PathManager from "./PathManager";
import PolygonManager from "./PolygonManager";


export default class PageSubEditor extends UIElement {

  components() {
    return {
      StarManager,
      PathManager,
      PolygonManager
    }
  }

  template() {
    return/*html*/`
      <div class='page-subeditor'>
        <PathManager />
        <PolygonManager />
        <StarManager />
        <SelectionManager />
      </div>
    `;
  }
}
