import {
  IF,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  isFunction,
  isUndefined,
  createComponent,
} from "sapa";

import { REFRESH_SELECTION } from "../../types/event";

import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export class ObjectProperty {
  /**
   *
   * @param {object} json
   * @param {string} json.title property panel title
   * @param {string} [json.editableProperty] editable property name
   * @param {string|Function} [json.action] action name or function
   * @param {Function} [json.inspector] inspector create function
   * @param {boolean} [json.visible=false] visible
   * @param {preventUpdate} [json.preventUpdate=false] prevent update
   * @returns {BaseProperty}
   */
  static create(json) {
    return class extends BaseProperty {
      getTitle() {
        return json.title;
      }

      getClassName() {
        return json.className || "item";
      }

      get editableProperty() {
        return json.editableProperty;
      }

      get order() {
        return isUndefined(json.order) ? 1000 : json.order;
      }

      afterComponentRendering($dom, refName, instance) {
        if (refName == "$comp") {
          const current = this.$context.selection?.current || {};
          const inspector = isFunction(json.inspector)
            ? json.inspector(current)
            : this.$context.components.createInspector(
                current,
                json.editableProperty
              );
          instance.setInspector(inspector);
        }
      }

      refresh() {
        const current = this.$context.selection.current || {};

        if (current || json.visible) {
          this.setTitle(
            json.title ||
              current.getDefaultTitle() ||
              current.itemType ||
              current.name
          );
          this.load();
        }
      }

      [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow")]() {
        if (json.preventUpdate) {
          if (this.$stateManager.isPointerUp) {
            this.refresh();
          }
        } else {
          this.refresh();
        }
      }

      [LOAD("$body")]() {
        var current = this.$context.selection?.current;

        if (!current && !json.visible) return "";

        const inspector = isFunction(json.inspector)
          ? json.inspector(current || {})
          : this.$context.components.createInspector(
              current || {},
              json.editableProperty
            );

        return createComponent("ComponentEditor", {
          ref: "$comp",
          inspector,
          onchange: "changeComponentProperty",
        });
      }

      getBody() {
        return /*html*/ `<div ref='$body'></div>`;
      }

      [SUBSCRIBE_SELF("changeComponentProperty")](key, value) {
        if (json.action) {
          this.command(json.action, `change attribute : ${key}`, key, value);
        } else {
          this.command(
            "setAttributeForMulti",
            `change attribute : ${key}`,
            this.$context.selection.packByValue({
              [key]: value,
            })
          );
        }
      }
    };
  }
}
