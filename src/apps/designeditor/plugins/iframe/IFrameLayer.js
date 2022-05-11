import icon from "elf/editor/icon/icon";
import { Component } from "elf/editor/model/Component";

export class IFrameLayer extends Component {
  getIcon() {
    return icon.web;
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "iframe",
      name: "New IFrame",
      url: "",
      ...obj,
    });
  }

  get url() {
    return this.get("url");
  }

  set url(value) {
    this.set("url", value);
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("url"),
  //   };
  // }

  getDefaultTitle() {
    return "IFrame";
  }
}
