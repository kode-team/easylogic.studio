import { html } from "../../../../../util/functions/func";
import icon from "../../../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT
} from "../../../../../util/Event";
import { WHITE_STRING } from "../../../../../util/css/types";
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
  SepiaFilter,
  Filter
} from "../../../../../editor/css-property/Filter";
import { editor } from "../../../../../editor/editor";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";


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



export default class FilterEditor extends UIElement {

  components() {
    return {
      RangeEditor,
      ColorViewEditor
    }
  }

  initState() {
    return {
      filters: Filter.parseStyle(this.props.value)
    }
  }

  template() {
    return html`
      <div class='filter-editor filter-list' ref='$filterList'>
          <div class='label' >
              <div class='tools'>
                <select ref="$filterSelect">
                  ${filterList.map(filter => {
                    return `<option value='${filter}'>${filter}</option>`;
                  })}
                </select>
                <button type="button" ref="$add" title="add Filter">${icon.add} Add</button>
              </div>
          </div>
          <div class='filter-list' ref='$filterList'>
            ${this.loadTemplate('$filterList')}
          </div>
      </div>`;
  }

  getSpec(filterType) {
    return specList[filterType];
  }

  makeDropShadowFilterTemplate(spec, filter, index) {
    return html`
      <div class="filter-item">
        <div class="title" draggable="true" data-index="${index}">
          <label>Drop Shadow</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>

        <div class="filter-ui drop-shadow-color">
          <label>${spec.color.title}</label>
          <ColorViewEditor ref='$dropShadowColorView${index}' params="${index}" color="${filter.color}" onChange="changeDropShadowColor" />
        </div>

        ${["offsetX", "offsetY", "blurRadius"].map(key => {
          return `        
            <div class="filter-ui drop-shadow">
                <label>${spec[key].title}</label>

                <RangeEditor 
                  ref='$${key}${index}' 
                  key="${index}" 
                  params="${key}" 
                  value="${filter[key].value.toString()}" units="${spec[key].units.join(',')}" onchange="changeRangeEditor" />
            </div>`;
        })}
      </div>
    `;
  }

  makeOneFilterTemplate(spec, filter, index) {
    return `
      <div class="filter-item" data-index="${index}">
        <div class="title" draggable="true" data-index="${index}">
          <label>${spec.title}</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
        <div class="filter-ui">
          <RangeEditor ref='$range${index}' key="${index}" value="${filter.value}" units="${spec.units.join(',')}" onchange="changeRangeEditor" />
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
    return this.state.filters.map((filter, index) => {
      return this.makeFilterTemplate(filter, index.toString());
    });
  }

  // filter-item 을 통째로  dragstart 를 걸어버리니깐
  // 다른 ui 를 핸들링 할 수가 없어서
  // title  에만 dragstart 거는 걸로 ok ?
  [DRAGSTART("$filterList .filter-item .title")](e) {
    this.startIndex = +e.$delegateTarget.attr("data-index");
  }

  // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
  [DRAGOVER("$filterList .filter-item") + PREVENT](e) {}



  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortFilter(startIndex, targetIndex) {
      this.sortItem(this.state.filters, startIndex, targetIndex);
  }

  [DROP("$filterList .filter-item") + PREVENT](e) {
    var targetIndex = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    this.sortFilter(this.startIndex, targetIndex);

    this.refresh();

    this.modifyFilter()
  }

  modifyFilter () {
    var value = this.state.filters.join(WHITE_STRING);

    this.parent.trigger(this.props.onchange, value)
  }

  makeFilter(type, opt = {}) {
    return Filter.parse({ ...opt, type });
  }

  [CLICK("$add")]() {
    var filterType = this.refs.$filterSelect.value;

    this.state.filters.push(this.makeFilter(filterType))

    this.refresh();

    this.modifyFilter()
  }

  [CLICK("$filterList .filter-menu .del")](e) {
    var index = +e.$delegateTarget.attr("data-index");
    this.state.filters.splice(index, 1);

    this.refresh();

    this.modifyFilter()
  }

  [EVENT("changeDropShadowColor")](color, params) {
    var index = +params;

    this.state.filters[index].reset({
      color
    });

    this.modifyFilter();

  }

  refresh() {
    this.load();
  }

  [EVENT('changeRangeEditor')] (key, value, params) {
    if (params) {
      this.state.filters[+key].reset({ 
        [params]: value 
      });
    } else {
      this.state.filters[+key].reset({ 
        value 
      });
    }
    

    this.modifyFilter();
  }
}
