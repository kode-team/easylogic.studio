import UIElement from "../../../util/UIElement";
import menuItems from "../control/menu-items/index";

export default class ToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return `
      <div class='tool-menu '>
        <div class='items'>
          <LeftAlign />
          <CenterAlign />
          <RightAlign />

          <TopAlign />
          <MiddleAlign />
          <BottomAlign />

          <SameWidth />
          <SameHeight />
          <CopyItem />

          <div class='split'></div>

          <ToggleRightItem />
        </div>

      </div>
    `;
  }
}
