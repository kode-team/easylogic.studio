import { registElement } from "el/base/registElement";
import MenuItem from "./MenuItem";

export default class SignButton extends MenuItem {
  getIcon() {
    return "github";
  }
  getTitle() {
    return "Sign";
  }

  clickButton(e) {
    this.emit('showSignWindow')
  }
}

registElement({ SignButton })