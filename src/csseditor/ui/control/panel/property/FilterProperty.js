import BaseProperty from "./BaseProperty";
import { html } from "../../../../../util/functions/func";
import icon from "../../../icon/icon";
import { LOAD, CLICK, CHANGE, INPUT } from "../../../../../util/Event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import {
  BlurFilter,
  GrayscaleFilter,
  HueRotateFilter,
  InvertFilter,
  BrightnessFilter,
  ContrastFilter,
  DropshadowFilter,
  OpacityFilter,
  SaturateFilter,
  SepiaFilter
} from "../../../../../editor/css-property/Filter";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";

var filterList = [
  "blur",
  "grayscale",
  "hue-rotate",
  "invert",
  "brightness",
  "contrast",
  "drop-shadow",
  "opacity",
  "saturate",
  "sepia"
];

var specList = {
  blur: BlurFilter.spec,
  grayscale: GrayscaleFilter.spec,
  "hue-rotate": HueRotateFilter.spec,
  invert: InvertFilter.spec,
  brightness: BrightnessFilter.spec,
  contrast: ContrastFilter.spec,
  "drop-shadow": DropshadowFilter.spec,
  opacity: OpacityFilter.spec,
  saturate: SaturateFilter.spec,
  sepia: SepiaFilter.spec
};

export default class FilterProperty extends BaseProperty {
  getTitle() {
    return "Filters";
  }
  getBody() {
    return `<div class='property-item filter-list' ref='$filterList'></div>`;
  }

  getTools() {
    return html`
      <select ref="$filterSelect">
        ${filterList.map(filter => {
          return `<option value='${filter}'>${filter}</option>`;
        })}
      </select>
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `;
  }

  getSpec(filterType) {
    return specList[filterType];
  }

  makeDropShadowFilterTemplate(spec, filter, index) {
    return html`
      <div class="filter-item">
        <div class="title">
          <label>Drop Shadow</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>

        <div class="filter-ui drop-shadow-color">
          <label>${spec.color.title}</label>
          <div class="preview">
            <div
              class="mini-view"
              style="background-color: ${filter.color}"
              ref="$miniView${index}"
              data-index="${index}"
              data-key="color"
            ></div>
          </div>
          <div class="color-code">
            <input
              type="text"
              ref="$colorCode${index}"
              value="${filter.color}"
              data-index="${index}"
              data-key="color"
            />
          </div>
        </div>

        ${["offsetX", "offsetY", "blurRadius"].map(key => {
          return `        
            <div class="filter-ui drop-shadow">
                <label>${spec[key].title}</label>
                <div class="slider">
                <input
                    type="range"
                    min="${spec[key].min}"
                    max="${spec[key].max}"
                    step="${spec[key].step}"
                    value="${filter[key].value}"
                    ref="$range${key}"
                    data-key="${key}"
                    data-index="${index}"
                />
                </div>
                <div class="input">
                <input
                    class="unit-value"
                    type="number"
                    min="${spec[key].min}"
                    max="${spec[key].max}"
                    step="${spec[key].step}"
                    value="${filter[key].value}"
                    data-index="${index}"
                    ref="$number${key}"
                    data-key="${key}"
                />
                </div>
                <div class="select">
                <select class="unit" ref="$unit${key}" data-key="${key}" data-index="${index}">
                    ${spec.offsetX.units.map(unit => {
                      return `<option value='${unit}' ${
                        filter.offsetX.unit === unit ? "selected" : ""
                      }>${unit}</option>`;
                    })}
                </select>
                </div>
            </div>`;
        })}
      </div>
    `;
  }

  makeOneFilterTemplate(spec, filter, index) {
    return html`
      <div class="filter-item">
        <div class="title">
          <label>${spec.title}</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
        <div class="filter-ui">
          <div class="slider">
            <input
              type="range"
              min="${spec.min}"
              max="${spec.max}"
              step="${spec.step}"
              value="${filter.value.value}"
              ref="$range${index}"
              data-index="${index}"
            />
          </div>
          <div class="input">
            <input
              class="unit-value"
              type="number"
              min="${spec.min}"
              max="${spec.max}"
              step="${spec.step}"
              value="${filter.value.value}"
              data-index="${index}"
              ref="$number${index}"
            />
          </div>
          <div class="select">
            <select class="unit" ref="$unit${index}" data-index="${index}">
              ${spec.units.map(unit => {
                return `<option value='${unit}' ${
                  filter.value.unit === unit ? "selected" : ""
                }>${unit}</option>`;
              })}
            </select>
          </div>
        </div>
      </div>
    `;
  }

  makeFilterTemplate(filter, index) {
    if (filter.type === "drop-shadow") {
      return this.makeDropShadowFilterTemplate(
        this.getSpec(filter.type),
        filter,
        index
      );
    } else {
      return this.makeOneFilterTemplate(
        this.getSpec(filter.type),
        filter,
        index
      );
    }
  }

  [LOAD("$filterList")]() {
    var current = editor.selection.current;

    if (!current) return EMPTY_STRING;

    return current.filters.map((filter, index) => {
      return this.makeFilterTemplate(filter, index.toString());
    });
  }

  [CLICK("$add")]() {
    var filterType = this.refs.$filterSelect.value;

    var current = editor.selection.current;
    if (current) {
      current.createFilter(filterType);

      this.emit("refreshCanvas");
    }

    this.refresh();
  }

  [CLICK("$filterList .filter-menu .del")](e) {
    var index = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (current) {
      current.removeFilter(index);

      this.emit("refreshCanvas");
    }

    this.refresh();
  }

  [CLICK("$filterList .filter-ui .mini-view")](e) {
    var index = +e.$delegateTarget.attr("data-index");
    var key = e.$delegateTarget.attr("data-key");
    var current = editor.selection.current;
    if (current) {
      var color = e.$delegateTarget.css("background-color");

      var rect = e.$delegateTarget.rect();

      this.emit(
        "showColorPicker",
        {
          changeEvent: "changeDropShadowColor",
          color,
          left: rect.left + 90,
          top: rect.top
        },
        { index, key }
      );
    }
  }

  [EVENT("changeDropShadowColor")](color, data) {
    var { index, key } = data;
    var current = editor.selection.current;
    if (current) {
      index = index.toString();
      current.updateFilter(index, {
        [key]: color
      });

      console.log(data);

      this.getRef("$miniView", index).css("background-color", color);
      this.getRef("$colorCode", index).val(color);

      this.emit("refreshCanvas");
    }
  }

  getRef(...args) {
    return this.refs[args.join(EMPTY_STRING)];
  }

  modifyInputRange(index, key, $source, $target, $unit) {
    $target.val($source);

    var current = editor.selection.current;
    if (current) {
      key = key || "value";

      current.updateFilter(index, {
        [key]: new Length($source.value, $unit.value)
      });

      this.emit("refreshCanvas");
    }
  }

  [INPUT('$filterList .filter-item input[type="range"]')](e) {
    var $el = e.$delegateTarget;
    var index = $el.attr("data-index");
    var key = $el.attr("data-key");

    this.modifyInputRange(
      index,
      key,
      $el,
      this.getRef("$number", key || index),
      this.getRef("$unit", key || index)
    );
  }

  [INPUT('$filterList .filter-item input[type="number"]')](e) {
    var $el = e.$delegateTarget;
    var index = $el.attr("data-index");
    var key = $el.attr("data-key");

    this.modifyInputRange(
      index,
      key,
      $el,
      this.getRef("$range", key || index),
      this.getRef("$unit", key || index)
    );
  }

  [CHANGE("$filterList .filter-item select")](e) {
    var $el = e.$delegateTarget;
    var index = $el.attr("data-index");
    var key = $el.attr("data-key");

    this.modifyInputRange(
      index,
      key,
      this.getRef("$number", key || index),
      this.getRef("$range", key || index),
      $el
    );
  }

  refresh() {
    this.load();
  }
}
