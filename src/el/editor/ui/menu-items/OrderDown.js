import MenuItem from "./MenuItem";
   
export default class OrderDown extends MenuItem {
  getIconString() {
    return 'horizontal_distribute';
  }
  // getTitle() {
  //   return "Top";
  // }

  isHideTitle () {
    return true; 
  }



  clickButton(e) {
    this.emit('item.move.depth.down');
  }
}