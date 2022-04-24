import MenuItem from "./MenuItem";
   
export default class OrderFirst extends MenuItem {
  getIconString() {
    return 'to_front';
  }

  getTitle() {
    return "To First";
  }

  clickButton(e) {
    this.command('send.back', 'send back', this.$selection.current);    
  }
}