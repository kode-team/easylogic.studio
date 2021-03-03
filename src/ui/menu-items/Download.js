import MenuItem from "./MenuItem";

export default class Download extends MenuItem {
  getIconString() {
    return 'archive';
  }
  getTitle() {
    return this.$i18n('menu.item.download.title');
  }

  clickButton(e) {
    this.emit('downloadJSON')
  }
}
