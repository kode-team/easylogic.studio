import MenuItem from "./MenuItem";

export default class Save extends MenuItem {
  getIconString() {
    return 'storage';
  }
  getTitle() {
    return this.$i18n('menu.item.save.title');
  }

  clickButton(e) {
    this.emit('saveJSON')
    this.nextTick(() => {
      this.emit('notify',  'alert', 'Save', 'Save the content on localStorage', 2000);    
    });
  }

  isHideTitle() {
    return true;
  }
}