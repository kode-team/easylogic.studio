import icon from "el/editor/icon/icon";
import { Component } from "el/editor/items/Component";

export class IFrameLayer extends Component {

  getIcon () {
    return icon.web;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'iframe',
      name: 'New IFrame',      
      url: '',
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('url'),
    }
  }


  getDefaultTitle() {
    return "IFrame";
  } 


}