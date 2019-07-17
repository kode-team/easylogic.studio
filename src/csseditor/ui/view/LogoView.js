import UIElement from "../../../util/UIElement";
import icon from "../icon/icon";

export default class LogoView extends UIElement {
  template() {
    return `
      <div class='logo'>
        <div class='text'>v<span class='brush'>${icon.brush}</span></div>
        <div class='extra-text'>alenti</div>
      </div>    
    `;
  }
}
