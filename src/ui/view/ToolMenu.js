import UIElement, { EVENT } from "@core/UIElement";
import menuItems from "../menu-items/index";
import { CLICK } from "@core/Event";

export default class ToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return /*html*/`
      <div class='tool-menu center'>
        <div class='items'>
          <div class='draw-items' ref='$items' data-selected-value="${this.$editor.layout}">

            <SelectTool />
            <AddArtBoard />
            <span data-item='css'>
              <AddRect />
              <AddCircle />         
              <AddText />
              <AddImage />
              <AddVideo />
            </span>            
            <span data-item='svg'>
              <div class='divider'></div>
              <AddDrawPath />
              <AddPath />
              <AddSVGRect />
              <AddSVGCircle />            
              <!-- <AddSVGText /> -->
              <AddSVGTextPath />
              <AddPolygon />
            </span>
          </div>
        </div>

      </div>
    `;
  }

  [EVENT('changedEditorlayout')] () {
    this.refs.$items.attr('data-selected-value', this.$editor.layout)
  }

  [EVENT('noneSelectMenu')] () {
    var $selected = this.refs.$items.$('.selected');
    if ($selected) {
      $selected.removeClass('selected');
    }
  }

  [CLICK('$items button')] (e) {
    e.$dt.onlyOneClass('selected');
  }
}
