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
          <KeyBoard />      
          <Fullscreen />      
          <ExportView />
          <ExportCodePen />
          <div class='divdier'></div>
          <Download />
          <Save />
          <Github />
          <Manual />          
        </div>                
      </div>
    `;
  }
}
 