import MenuItem from "./MenuItem";

export default class AddCube extends MenuItem {
  getIconString() {
    return 'cube';
  }
  getTitle() {
    return this.props.title || "Cube";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('addLayerView', 'cube');
  }

}
