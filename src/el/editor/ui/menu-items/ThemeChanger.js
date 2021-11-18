import MenuItem from "./MenuItem";
   
export default class ThemeChanger extends MenuItem {
  getIconString() {
    return 'dark';
  }
  getTitle() {
    return "Theme";
  }

  isHideTitle() {
    return true;
  }

  clickButton(e) {
    if (this.$config.get('editor.theme') === 'dark') {
      this.$config.set('editor.theme', 'light');
    } else {
      this.$config.set('editor.theme', 'dark');
    }
  }

}