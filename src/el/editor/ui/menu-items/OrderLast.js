import MenuItem from "./MenuItem";
   
export default class OrderLast extends MenuItem {
  getIconString() {
    return 'to_back';
  }

  getTitle() {
    return "To Last";
  }

  clickButton(e) {
    this.emit('item.move.depth.last');
  }
}