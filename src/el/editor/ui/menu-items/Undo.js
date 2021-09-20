import MenuItem from "./MenuItem";
   
export default class Undo extends MenuItem {
  getIconString() {
    return 'undo';
  }
  getTitle() {
    return "Undo";
  }

  clickButton(e) {
    this.emit('history.undo');
  }
}