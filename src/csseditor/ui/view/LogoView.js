import UIElement from "../../../util/UIElement";
import icon from "../icon/icon";

export default class LogoView extends UIElement {
  template() {
    return /*html*/`
      <div class='logo'>
        <div class='text'>Easy</div>
        <div class='extra-text'> &nbsp;&nbsp;&nbsp;Logic</div>
      </div>    
    `;
  }
}
