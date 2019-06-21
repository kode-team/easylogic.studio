import UIElement from "../../../util/UIElement";
import menuItems from "../control/menu-items/index";

export default class ToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return `
      <div class='tool-menu'>
        <div class='items left'>
          <div class='logo'>
            <div class='text'>Easylogic</div>
            <div class='site'>Studio</div>
          </div>
        </div>
        <div class='items  right'>
          <ExportCodePen />
          <ExportJSFiddle />
          <Github />
        </div>                
      </div>
    `;
  }
}
