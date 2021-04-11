
import { Component } from "el/editor/items/Component";
import icon from "el/editor/icon/icon";
import { VUE_COMPONENT_TYPE } from "./constants";

export class VueComponentLayer extends Component {

  getIcon () {
    return icon.chart;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: VUE_COMPONENT_TYPE,
      name: "New Vue Component",
      value: 'test',
      ...obj
    }); 
  }

  toCloneObject() {

    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'value'
      ),
    }
  }

  enableHasChildren() {
    return false; 
  }

  getDefaultTitle() {
    return "Vue Component";
  }

}
