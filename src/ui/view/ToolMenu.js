import UIElement, { EVENT } from "@core/UIElement";
import "../menu-items/index";
import { CLICK } from "@core/Event";
import { registElement } from "@core/registerElement";

export default class ToolMenu extends UIElement {
  template() {
    return /*html*/`
      <div class='tool-menu center'>
        <div class='items'>
          <div class='draw-items' ref='$items' data-selected-value="${this.$editor.layout}">

            <object refClass='SelectTool' />
            <object refClass='AddArtBoard' />
            <span data-item='css'>
              <object refClass='AddRect' />
              <object refClass='AddCircle' />         
              <object refClass='AddText' />
              <object refClass='AddImage' />
              <object refClass='AddVideo' />
              <object refClass='AddIFrame' />
            </span>            
            <span data-item='svg'>
              <div class='divider'></div>
              <object refClass='AddDrawPath' />
              <object refClass='AddPath' />
              <object refClass='AddSVGRect' />
              <object refClass='AddSVGCircle' />            
              <!-- <AddSVGText /> -->
              <object refClass='AddSVGTextPath' />
              <object refClass='AddPolygon' />
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

registElement({ ToolMenu })