import MenuItem from "./MenuItem";

export default class Github extends MenuItem {
  getIcon() {
    return "github";
  }
  getTitle() {
    return "Github";
  }

  clickButton(e) {
    window.open("https://github.com/easylogic/editor", "github-window");
  }
}
