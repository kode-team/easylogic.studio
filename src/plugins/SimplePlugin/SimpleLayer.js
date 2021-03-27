import { Component } from "@items/Component";
import icon from "./icon";

export default class SimpleLayer extends Component {

  getIcon () {
    return icon;
  }  

  convert(json) {

    if (typeof json.value !== 'number') {
      json.value = Math.floor(json.value);
    }

    return json; 
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'simple',
      name: "New Simple",
      options: [1, 2, 3, 4, 5],
      value: 1,
      ...obj
    }); 
  }

  getProps() {
    return [
      {
        key: `value`, 
        editor: 'SelectEditor', 
        editorOptions: {
          label: 'Option Value',
          options: this.json.options
        }, 
        refresh: true, 
        defaultValue: this.json['value'] 
      }
    ]
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
