import {
  DEBOUNCE,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  isFunction,
  isString,
  createComponent,
} from "sapa";

import "./ComponentProperty.scss";

import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class ComponentProperty extends BaseProperty {
  getClassName() {
    return "component-property";
  }

  getTitle() {
    return "Component";
  }

  isShow() {
    var current = this.$context.selection.current;
    const inspector = this.$context.components.createInspector(current);
    if (current && (current.is("component") || inspector.length > 0)) {
      return true;
    }

    return false;
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      const current = this.$context.selection.current;
      const inspector = this.$context.components.createInspector(current);
      return inspector.length > 0;
    });
  }

  refresh() {
    var current = this.$context.selection.current;

    if (current) {
      this.setTitle(
        current.getDefaultTitle() || current.itemType || current.name
      );
      this.load();
    }
  }

  getBody() {
    return /*html*/ `
      <div ref='$body'></div>
    `;
  }

  [LOAD("$body")]() {
    var current = this.$context.selection.current;

    if (!current) return "";

    const inspector = this.$context.components.createInspector(current);

    inspector.forEach((it) => {
      if (isString(it)) {
        return;
      }

      let defaultValue = current[it.key] || it.defaultValue;

      if (isFunction(it.convertDefaultValue)) {
        defaultValue = it.convertDefaultValue(current, it.key);
      }

      it.defaultValue = defaultValue;
    });

    return createComponent("ComponentEditor", {
      ref: "$comp",
      inspector,
      onchange: "changeComponentProperty",
    });
  }

  [SUBSCRIBE_SELF("changeComponentProperty")](key, value) {
    this.command(
      "setAttributeForMulti",
      "change component : " + key,
      this.$context.selection.packByValue({
        [key]: value,
      })
    );
  }
}
