import MenuItem from "./MenuItem";

export default class Fullscreen extends MenuItem {
  getIconString() {
    return 'fullscreen';
  }
  getTitle() {
    return this.$i18n('menu.item.fullscreen.title');
  }

  clickButton(e) {
    this.emit('toggle.fullscreen')
  }
}
