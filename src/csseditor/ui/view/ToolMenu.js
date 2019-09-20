import UIElement, { EVENT } from "../../../util/UIElement";
import menuItems from "../menu-items/index";
import { CLICK } from "../../../util/Event";

export default class ToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return /*html*/`
      <div class='tool-menu '>
        <div class='items'>
          <div class='draw-items' ref='$items'>
            <!--<label>CSS</label>-->
            <SelectTool />
            <AddRect />
            <AddCircle />         
            <AddText />
            <AddImage />
            <AddCube />
            <!-- AddSphere / -->
            <div class='split'></div>
            <!--<label>SVG</label>-->
            <AddPath />
            <AddPolygon />
            <AddStar />
            <!-- <AddRedGL /> -->
          </div>
        </div>

      </div>
    `;
  }

  [EVENT('noneSelectMenu')] () {
    var $selected = this.refs.$items.$('.selected');
    if ($selected) {
      $selected.removeClass('selected');
    }
  }

  [CLICK('$items button')] (e) {
    e.$delegateTarget.onlyOneClass('selected');
  }
}
