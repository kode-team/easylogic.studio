import MenuItem from "./MenuItem";

export default class ThemeChanger extends MenuItem {
  getIconString() {
    if (this.$config.is("editor.theme", "dark")) {
      return "dark";
    } else {
      return "light";
    }
  }
  getTitle() {
    return "Theme";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    if (this.$config.get("editor.theme") === "dark") {
      this.$config.set("editor.theme", "light");
      this.setIcon("light");
    } else {
      this.$config.set("editor.theme", "dark");
      this.setIcon("dark");
    }
  }
}
