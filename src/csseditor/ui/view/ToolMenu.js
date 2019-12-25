import UIElement, { EVENT } from "../../../util/UIElement";
import menuItems from "../menu-items/index";
import { CLICK } from "../../../util/Event";

export default class ToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return /*html*/`
      <div class='tool-menu center'>
        <div class='items'>
          <div class='draw-items' ref='$items'>
            <SelectTool />
            <AddRect />
            <AddCircle />         
            <AddText />
            <AddImage />
            <div class='split'></div>
            <AddPath />
            <AddSVGText />
            <AddSVGTextPath />
            <AddPolygon />
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
