import MenuItem from "./MenuItem";
   
export default class OrderFirst extends MenuItem {
  getIconString() {
    return 'to_front';
  }

  getTitle() {
    return "To First";
  }

  clickButton(e) {
    this.emit('item.move.depth.first');
  }
}