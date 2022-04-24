import MenuItem from "./MenuItem";
 
export default class AddSVGTextPath extends MenuItem {
  getIconString() {
    return 'text_rotate';
  }
  getTitle() {
    return this.props.title || "TextPath";
  }
 
  clickButton(e) {
    this.emit('addLayerView', 'svg-textpath');
  }

  isHideTitle() {
    return true;
  }

}