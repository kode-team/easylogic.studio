import { LOAD, CLICK, DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF, IF } from "sapa";

import { iconUse } from "elf/editor/icon/icon";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";
import { filter_list } from "./util";
import { createComponent } from "sapa";

import "./FilterProperty.scss";

export default class FilterProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("filter.property.title");
  }

  hasKeyframe() {
    return true;
  }

  isFirstShow() {
    return true;
  }

  afterRender() {
    this.show();
  }

  getKeyframeProperty() {
    return "filter";
  }

  getTitleClassName() {
    return "filter";
  }

  getBodyClassName() {
    return "no-padding";
  }

  getBody() {
    return `<div class='full filter-property' ref='$body'></div>`;
  }

  getTools() {
    return /*html*/ `
      <select class='filter-select' ref="$filterSelect">      
      </select>
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
    var current = this.$selection.currentProject;
    var arr = [];

    if (current) {
      arr = current.svgfilters.map((it) => {
        var id = it.id;
        return {
          title: `svg - #${id}`,
          value: id,
        };
      });
    }

    return arr;
  }

  [LOAD("$body")]() {
    var current = this.$selection.current || {};
    var value = current.filter;

    return createComponent("FilterEditor", {
      ref: "$filterEditor",
      key: "filter",
      value,
      onchange: "changeFilterEditor",
    });
  }

  [SUBSCRIBE_SELF("changeFilterEditor")](key, filter) {
    this.command(
      "setAttributeForMulti",
      "change filter",
      this.$selection.packByValue({
        [key]: filter,
      })
    );
  }

  get editableProperty() {
    return "filter";
  }

  [SUBSCRIBE("refreshSelection") + IF("checkShow") + DEBOUNCE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSVGArea") + DEBOUNCE(100)]() {
    this.load("$filterSelect");
  }
}
