import { CLICK, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { css } from "@emotion/css";
import SelectTool from "el/editor/ui/menu-items/SelectTool";
import AddArtboard from "el/editor/ui/menu-items/AddArtboard";
import AddRect from "el/editor/ui/menu-items/AddRect";
import AddCircle from "el/editor/ui/menu-items/AddCircle";
import AddText from "el/editor/ui/menu-items/AddText";
import AddImage from "el/editor/ui/menu-items/AddImage";
import AddVideo from "el/editor/ui/menu-items/AddVideo";
import AddDrawPath from "el/editor/ui/menu-items/AddDrawPath";
import AddPath from "el/editor/ui/menu-items/AddPath";
import AddSVGRect from "el/editor/ui/menu-items/AddSVGRect";
import AddSVGCircle from "el/editor/ui/menu-items/AddSVGCircle";
import AddSVGTextPath from "el/editor/ui/menu-items/AddSVGTextPath";

export default class ToolMenu extends EditorElement {

  components() {
    return {
      SelectTool,
      AddArtboard,
      AddRect,
      AddCircle,
      AddText,
      AddImage,
      AddVideo,
      AddDrawPath,
      AddPath,
      AddSVGRect,
      AddSVGCircle,
      AddSVGTextPath,
    }
  }

  afterRender() {
    setTimeout(() => {
      this.$el.$$(".elf--menu-item").forEach(it => {
        it.attr('data-direction', 'right');
      })
    }, 500);

  }

  template() {
    return /*html*/`
      <div class='tool-menu center'>
        <div class='items'>
          <div class='draw-items' ref='$items' data-selected-value="${this.$editor.layout}">

            <object refClass='SelectTool' />
            <object refClass='AddArtboard' />
            <span data-item='css'>
              <object refClass='AddRect' />
              <object refClass='AddCircle' />         
              <object refClass='AddText' />
              <object refClass='AddImage' />
              <object refClass='AddVideo' />
              ${this.$menuManager.generate('tool.menu.css')}
            </span>            
            <span data-item='svg'>
              <div class='${css(`display: block;height:2px;width:100%;border-bottom:1px solid var(--elf--border-color);`)}' ></div>
              <object refClass='AddDrawPath' />
              <object refClass='AddPath' />
              <object refClass='AddSVGRect' />
              <object refClass='AddSVGCircle' />            
              <!-- <AddSVGText /> -->
              <object refClass='AddSVGTextPath' />
              <object refClass='AddPolygon' />
              ${this.$menuManager.generate('tool.menu.svg')}              
            </span>
          </div>
        </div>

      </div>
    `;
  }

  [SUBSCRIBE('changedEditorlayout')] () {
    this.refs.$items.attr('data-selected-value', this.$editor.layout)
  }

  [SUBSCRIBE('noneSelectMenu')] () {
    var $selected = this.refs.$items.$('.selected');
    if ($selected) {
      $selected.removeClass('selected');
    }
  }

  [CLICK('$items button')] (e) {
    e.$dt.onlyOneClass('selected');
  }
}