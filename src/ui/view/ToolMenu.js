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

            <span refClass='SelectTool' />
            <span refClass='AddArtBoard' />
            <span data-item='css'>
              <span refClass='AddRect' />
              <span refClass='AddCircle' />         
              <span refClass='AddText' />
              <span refClass='AddImage' />
              <span refClass='AddVideo' />
            </span>            
            <span data-item='svg'>
              <div class='divider'></div>
              <span refClass='AddDrawPath' />
              <span refClass='AddPath' />
              <span refClass='AddSVGRect' />
              <span refClass='AddSVGCircle' />            
              <!-- <AddSVGText /> -->
              <span refClass='AddSVGTextPath' />
              <span refClass='AddPolygon' />
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
