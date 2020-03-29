import UIElement from "../../../util/UIElement";
import menuItems from "../menu-items/index";

export default class PreviewToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return /*html*/`
      <div class='preview-tool-menu'>
        <div class='items'>
          <div class='empty'></div>
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
 