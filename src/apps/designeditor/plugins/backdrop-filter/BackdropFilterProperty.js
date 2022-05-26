import {
  LOAD,
  CLICK,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  IF,
  DEBOUNCE,
  clone,
  createComponent,
} from "sapa";

import "./BackdropFilterProperty.scss";
import { filter_list } from "./util";

import { iconUse } from "elf/editor/icon/icon";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class BackdropFilterProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("backdrop.filter.property.title");
  }

  getTitleClassName() {
    return "filter";
  }

  getBodyClassName() {
    return "no-padding";
  }

  getBody() {
    return /*html*/ `<div class='full filter-property' ref='$body'></div>`;
  }

  getTools() {
    return /*html*/ `
      <select class="filter-select" ref="$filterSelect"></select>
      <button type="button" ref="$add" title="add Filter">${iconUse(
        "add"
      )}</button>
    `;
  }

  [CLICK("$add")]() {
    var filterType = this.refs.$filterSelect.value;

    this.children.$filterEditor.trigger("add", filterType);
  }

  [LOAD("$filterSelect")]() {
    var list = filter_list.map((it) => {
      return { title: this.$i18n(`filter.property.${it}`), value: it };
    });

    var svgFilterList = this.getSVGFilterList();

    var totalList = [];

    if (svgFilterList.length) {
      totalList = [...list, { title: "-------", value: "" }, ...svgFilterList];
    } else {
      totalList = [...list];
    }

    return totalList.map((it) => {
      var { title, value } = it;

      return `<option value='${value}'>${title}</option>`;
    });
  }

  getSVGFilterList() {
    var current = this.$context.selection.currentProject;
    var arr = [];

    if (current) {
      arr = current.svgfilters.map((it) => {
        return {
          title: `svg - #${it.id}`,
          value: it.id,
        };
      });
    }

    return arr;
  }

  [LOAD("$body")]() {
    var current = this.$context.selection.current || {};
    var value = current.backdropFilter;

    return /*html*/ `
      <div>
        ${createComponent("FilterEditor", {
          ref: "$filterEditor",
          key: "backdropFilter",
          value: clone(value),
          hideLabel: true,
          onchange: "changeFilterEditor",
        })}
      </div>
    `;
  }

  [SUBSCRIBE_SELF("changeFilterEditor")](key, filter) {
    this.$commands.executeCommand(
      "setAttribute",
      "change backdrop filter",
      this.$context.selection.packByValue({
        [key]: clone(filter),
      })
    );
  }

  get editableProperty() {
    return "backdropFilter";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow") + DEBOUNCE(1000)]() {
    this.refresh();
  }
}
