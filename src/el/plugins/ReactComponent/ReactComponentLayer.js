import { Component } from "el/editor/items/Component";
import icon from "el/editor/icon/icon";
import { REACT_COMPONENT_TYPE } from "./constants";


export class ReactComponentLayer extends Component {

  getIcon () {
    return icon.chart;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: REACT_COMPONENT_TYPE,
      name: "New React Component",
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
    return "React Component";
  }

}
