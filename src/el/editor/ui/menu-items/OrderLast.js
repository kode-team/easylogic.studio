import MenuItem from "./MenuItem";
   
export default class OrderLast extends MenuItem {
  getIconString() {
    return 'to_back';
  }

  getTitle() {
    return "To Last";
  }

  clickButton(e) {
    this.command('bring.front', 'bring front', this.$selection.current);    
  }
}