import MenuItem from "./MenuItem";
   
export default class SameWidth extends MenuItem {
  getIconString() {
    return 'horizontal_distribute';
  }
  getTitle() {
    return "width";
  }

  isHideTitle () {
    return true; 
  }

  clickButton(e) {
    this.emit('same.width');
  }
}