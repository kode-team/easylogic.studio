import { Component } from "el/editor/items/Component";
import { SIMPLE_TYPE } from "./constants";
import icon from "./icon";

export default class SimpleLayer extends Component {

  getIcon () {
    return icon;
  }  

  convert(json) {
    json = super.convert(json);

    if (typeof json.value !== 'number') {
      json.value = Math.floor(json.value);
    }

    return json; 
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: SIMPLE_TYPE,
      name: "New Simple",
      options: [1, 2, 3, 4, 5],
      value: 1,
    }); 
  }

  toCloneObject() {

    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'options',
      ),
    }
  }

  enableHasChildren() {
    return false; 
  }

  getDefaultTitle() {
    return "Simple";
  }

}
