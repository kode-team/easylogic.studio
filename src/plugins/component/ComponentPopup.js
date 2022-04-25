import {
  BIND,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  isFunction,
  createComponent,
} from "sapa";

import "./ComponentPopup.scss";

import BasePopup from "elf/editor/ui/popup/BasePopup";

export default class ComponentPopup extends BasePopup {
  getClassName() {
    return "component-property w(800)";
  }

  getTitle() {
    return "Component";
  }

  initState() {
    return {
      title: "",
      inspector: [],
    };
  }

  refresh() {
    this.setTitle(this.state.title || this.getTitle());
    this.load();
  }

  getBody() {
    return /*html*/ `
      <div ref='$body'></div>
    `;
  }

  [BIND("$body")]() {
    return {
      style: {
        width: this.state.width || 250,
      },
    };
  }

  [LOAD("$body")]() {
    const inspector = this.state.inspector;

    return createComponent("ComponentEditor", {
      inspector,
      onchange: "changeComponent",
    });
  }

  [SUBSCRIBE_SELF("changeComponent")](key, value) {
    if (isFunction(this.state.changeEvent)) {
      this.emit(this.state.changeEvent, key, value);
    }
  }

  [SUBSCRIBE("showComponentPopup")](data) {
    this.setState(data, false);

    this.refresh();

    this.show(data.width);
  }
}
