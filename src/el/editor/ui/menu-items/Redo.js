import MenuItem from "./MenuItem";
   
export default class Redo extends MenuItem {
  getIconString() {
    return 'redo';
  }
  getTitle() {
    return "Redo";
  }

  clickButton(e) {
    this.emit('history.redo');
  }
}