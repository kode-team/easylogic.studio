import UIElement from "../../../util/UIElement";
import menuItems from "../menu-items/index";

export default class ExternalToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return /*html*/`
      <div class='external-tool-menu'>
        <div class='items  right'>
          <Download />
          <Save />
          <ExportView />
          <ExportCodePen />
          <Fullscreen />
          <!-- ExportJSFiddle / -->

          <div class='split'></div>
          
          <!--ThemeSwitcher /-->
          <Github />
          <Manual />
          <!-- LoginButton /-->
          <!-- SignButton /-->
        </div>                
      </div>
    `;
  }
}
