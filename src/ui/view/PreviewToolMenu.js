import { registElement } from "@sapa/registerElement";
import UIElement from "@sapa/UIElement";
import "../menu-items/index";

export default class PreviewToolMenu extends UIElement {

  template() {
    return /*html*/`
      <div class='preview-tool-menu'>
        <div class='items'>
          <object refClass="KeyBoard" />      
          <object refClass="Fullscreen" />      
          <object refClass="ExportView" />
          <object refClass="ExportCodePen" />
          <div class='divdier'></div>
          <object refClass="Download" />
          <object refClass="Save" />
          <object refClass="Github" />
          <object refClass="Manual" />          
        </div>                
      </div>
    `;
  }
}

registElement({ PreviewToolMenu })
 