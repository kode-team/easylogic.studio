import MenuItem from "./MenuItem";
   
export default class OrderTop extends MenuItem {
  getIconString() {
    return 'to_front';
  }

  getTitle() {
    return "To Front";
  }

  clickButton(e) {
    this.emit('item.move.depth.up');
  }
}