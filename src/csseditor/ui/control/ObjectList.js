import UIElement from "../../../util/UIElement";
import { CLICK } from "../../../util/Event";
import menuItems from "../menu-items";
import LayerTab from "./LayerTab";

export default class ObjectList extends UIElement {
  components() {
    return {
      ...menuItems,
      LayerTab
    }
  }
  template() {
    return /*html*/`
      <div class="feature-control object-list">
        <LayerTab />
        <div class='draw-items' ref='$items'>
          <label>CSS</label>
          <AddRect />
          <AddCircle />         
          <AddText />
          <AddImage />
          <AddCube />
          <!-- AddSphere / -->
          <div class='split'></div>
          <label>SVG</label>
          <AddSVGRect />
          <AddPath />
          <!-- <AddRedGL /> -->
        </div>
      </div>
    `;
  }

  [CLICK('$items button')] (e) {
    e.$dt.onlyOneClass('selected');
  }

}
