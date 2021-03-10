import { registElement } from "@core/registerElement";
import UIElement from "@core/UIElement";
import menuItems from "../menu-items/index";

export default class PreviewToolMenu extends UIElement {
  components() {
    return menuItems;
  }

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
 