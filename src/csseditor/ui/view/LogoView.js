import UIElement from "../../../util/UIElement";
import icon from "../icon/icon";

export default class LogoView extends UIElement {
  template() {
    return `
      <div class='logo'>
        <div class='text'>e<span class='brush'>${icon.brush}</span></div>
        <div class='extra-text'>asylogic</div>
      </div>    
    `;
  }
}
