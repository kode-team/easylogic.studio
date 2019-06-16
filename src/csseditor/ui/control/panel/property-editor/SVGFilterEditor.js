import { html, isFunction } from "../../../../../util/functions/func";
import icon from "../../../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT
} from "../../../../../util/Event";
import { WHITE_STRING, NEW_LINE_2, NEW_LINE } from "../../../../../util/css/types";
import { editor } from "../../../../../editor/editor";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";
import { GaussianBlurSVGFilter, SVGFilter, TurbulenceSVGFilter, DisplacementMapSVGFilter } from "../../../../../editor/css-property/SVGFilter";
import SelectEditor from "./SelectEditor";
import TextEditor from "./TextEditor";
import NumberRangeEditor from "./NumberRangeEditor";


var filterList = [
  "GaussianBlur",
  "Turbulence",
  "DisplacementMap"
];

var specList = {
  GaussianBlur: GaussianBlurSVGFilter.spec,
  Turbulence: TurbulenceSVGFilter.spec,
  DisplacementMap: DisplacementMapSVGFilter.spec
};


export default class SVGFilterEditor extends UIElement {

  components() {
    return {
      NumberRangeEditor,
      RangeEditor,
      ColorViewEditor,
      SelectEditor,
      TextEditor
    }
  }

  initState() {
    return {
      filters: this.props.value || []
    }
  }

  template() {
    return html`
      <div class='svg-filter-editor filter-list'>
          <div class='label' >
              <label>${this.props.title || ''}</label>
              <div class='tools'>
                <select ref="$filterSelect">
                  ${filterList.map(filter => {
                    return `<option value='${filter}'>${filter}</option>`;
                  })}
                </select>
                <button type="button" ref="$add" title="add Filter">${icon.add} ${this.props.title ? '' : 'Add'}</button>
              </div>
          </div>
          <div class='filter-list' ref='$filterList'></div>
      </div>`;
  }

  getSpec(filterType) {
    return specList[filterType];
  }

  makeFilterEditorTemplate (s, filter, key, index) {

    if (s.inputType === 'select') {

      var options = s.options

      if (isFunction(s.options)){
        options = s.options(this.state.filters)
      }

      return `
        <div>
          <SelectEditor 
            ref='$select${key}${index}' 
            label="${s.title}"
            options='${options}' 
            key="${key}"
            params="${index}"
            value='${filter[key]}' 
            onchange="changeRangeEditor"             
          />
        </div>
        `
    } else if (s.inputType === 'text') {
      return `
        <div>
          <TextEditor 
            ref='$text${key}${index}' 
            label="${s.title}"
            key="${key}"
            params="${index}"
            value='${filter[key]}' 
            onchange="changeRangeEditor"
          />
        </div>
        `
    } else if (s.inputType === 'number-range') {
      return `
        <div>
          <NumberRangeEditor 
            ref='$numberrange${key}${index}' 
            layout='block' 
            label="${s.title}" 
            min="${s.min}"
            max="${s.max}"
            step="${s.step}"
            key="${key}" 
            params="${index}" 
            value="${filter[key]}" 
            onchange="changeRangeEditor" 
          />
        </div>
      `
    }

    return `
      <div>
        <RangeEditor 
          ref='$range${key}${index}' 
          layout='block' 
          calc='false' 
          label="${s.title}" 
          min="${s.min}"
          max="${s.max}"
          step="${s.step}"
          key="${key}" 
          params="${index}" 
          value="${filter[key]}" 
          units="${s.units.join(',')}" 
          onchange="changeRangeEditor" 
        />
      </div>
    `
  }

  makeOneFilterTemplate(spec, filter, index) {

    return `
    <div class="filter-item" data-index="${index}">
      <div class="title" draggable="true" data-index="${index}">
        <label>${filter.type}</label>
        <div class="filter-menu">
          <button type="button" class="del" data-index="${index}">${icon.remove2}</button>
        </div>
      </div>
      <div class="filter-ui">

        ${Object.keys(spec).map(key => {
          return this.makeFilterEditorTemplate(spec[key], filter, key, index);
        }).join(WHITE_STRING)}

      </div>
    </div>
  `;
  }

  makeFilterTemplate(filter, index) {
    return this.makeOneFilterTemplate(
      this.getSpec(filter.type),
      filter,
      index
    );
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
    this.parent.trigger(this.props.onchange, this.props.key, this.state.filters)
  }

  makeFilter(type, opt = {}) {
    return SVGFilter.parse({ ...opt, type });
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

  [EVENT('changeRangeEditor')] (key, value, index) {
    var filter =  this.state.filters[+index];
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
    this.modifyFilter();
  }
}
