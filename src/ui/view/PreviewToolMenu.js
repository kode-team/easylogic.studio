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
          <span refClass="KeyBoard" />      
          <span refClass="Fullscreen" />      
          <span refClass="ExportView" />
          <span refClass="ExportCodePen" />
          <div class='divdier'></div>
          <span refClass="Download" />
          <span refClass="Save" />
          <span refClass="Github" />
          <span refClass="Manual" />          
        </div>                
      </div>
    `;
  }
}
 