import BaseProperty from "./BaseProperty";
import { INPUT, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import { EMPTY_STRING } from "../../../../../util/css/types";

const fields = ["margin", "padding"];
let styleKeys = [];
fields.forEach(field => {
  styleKeys.push(...["Top", "Bottom", "Left", "Right"].map(it => field + it));
});

export default class BoxModelProperty extends BaseProperty {
  getTitle() {
    return "Box Model";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    this.load();
  }

  getBody() {
    return html`
      <div class="property-item box-model-item" ref="$boxModelItem"></div>
    `;
  }

  templateInput(key, current) {
    return `<input type="number" ref="$${key}" value="${current[
      key
    ].value.toString()}" />`;
  }

  [LOAD("$boxModelItem")]() {
    var current = editor.selection.current;

    if (!current) return EMPTY_STRING;

    return html`
      <div>
        <div class="margin">
          <div data-value="top">
            ${this.templateInput("marginTop", current)}
          </div>
          <div data-value="bottom">
            ${this.templateInput("marginBottom", current)}
          </div>
          <div data-value="left">
            ${this.templateInput("marginLeft", current)}
          </div>
          <div data-value="right">
            ${this.templateInput("marginRight", current)}
          </div>
        </div>
        <div class="padding">
          <div data-value="top">
            ${this.templateInput("paddingTop", current)}
          </div>
          <div data-value="bottom">
            ${this.templateInput("paddingBottom", current)}
          </div>
          <div data-value="left">
            ${this.templateInput("paddingLeft", current)}
          </div>
          <div data-value="right">
            ${this.templateInput("paddingRight", current)}
          </div>
        </div>
        <div
          class="content"
          ref="$content"
          title="${current.width.toString()} x ${current.height.toString()}"
        ></div>
      </div>
    `;
  }

  [INPUT("$boxModelItem input")](e) {
    this.resetBoxModel();
  }

  resetBoxModel() {
    var data = {};

    styleKeys.forEach(key => {
      data[key] = Length.px(this.getRef("$", key).value);
    });

    var current = editor.selection.current;

    if (current) {
      current.reset(data);

      this.emit("refreshCanvas");
    }
  }

  [EVENT("setSize")]() {
    var current = editor.selection.current;

    if (current) {
      this.refs.$content.attr(
        "title",
        `${current.width.toString()} x ${current.height.toString()}`
      );
    }
  }
}
