import MenuItem from "./MenuItem";
 
export default class AddRect extends MenuItem {
  getIcon() {
    return 'rect';
  }
  getTitle() {
    return "1. Rect";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('add.rect')
  }
}
