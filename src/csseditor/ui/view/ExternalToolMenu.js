import UIElement from "../../../util/UIElement";
import menuItems from "../control/menu-items/index";

export default class ExternalToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return `
      <div class='external-tool-menu'>
        <div class='items  right'>
          <ExportCodePen />
          <ExportJSFiddle />
          <Github />

          <div class='split'></div>

          <ThemeSwitcher />
        </div>                
      </div>
    `;
  }
}
