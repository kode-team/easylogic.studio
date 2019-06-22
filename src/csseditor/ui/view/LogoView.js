import UIElement from "../../../util/UIElement";

export default class LogoView extends UIElement {
  template() {
    return `
      <div class='logo'>
        <div class='text'>Easylogic</div>
        <div class='site'>Studio</div>
      </div>    
    `;
  }
}
