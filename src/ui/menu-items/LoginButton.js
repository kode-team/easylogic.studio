import { registElement } from "@sapa/registerElement";
import MenuItem from "./MenuItem";

export default class LoginButton extends MenuItem {
  getIcon() {
    return "github";
  }
  getTitle() {
    return "Login";
  }

  clickButton(e) {
    this.emit('showLoginWindow')
  }
}

registElement({ LoginButton })