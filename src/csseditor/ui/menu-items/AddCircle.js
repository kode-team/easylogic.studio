import MenuItem from "./MenuItem";
   
export default class AddCircle extends MenuItem {
  getIcon() {
    return 'circle';
  }
  getTitle() {
    return "2. Circle";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('add.circle');
  }

}
