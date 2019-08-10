import icon from "../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT,
  DEBOUNCE
} from "../../../util/Event";

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
  Filter,
  URLSvgFilter
} from "../../../editor/css-property/Filter";
import { editor } from "../../../editor/editor";
import UIElement, { EVENT } from "../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";
import SelectEditor from "./SelectEditor";


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
  "sepia",
  'svg',
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
  sepia: SepiaFilter.spec,
  svg: URLSvgFilter.spec
};

export default class FilterEditor extends UIElement {

  components() {
    return {
      SelectEditor,
      RangeEditor,
      ColorViewEditor
    }
  }

  initState() {
    return {
      hideLabel: this.props['hide-label'] === 'true' ? true : false, 
      filters: Filter.parseStyle(this.props.value)
    }
  }

  template() {
    var labelClass = this.state.hideLabel ? 'hide' : '';
    return `
      <div class='filter-editor filter-list'>
          <div class='label ${labelClass}' >
              <label>${this.props.title || ''}</label>
              <div class='tools'>
                <select ref="$filterSelect"></select>
                <button type="button" ref="$add" title="add Filter">${icon.add}</button>
              </div>
          </div>
          <div class='filter-list' ref='$filterList'></div>
      </div>`;
  }

  [LOAD('$filterSelect')] () {
    var list = filterList.map(it => { 
      return {title: it, value: it}
    })

    var svgFilterList = this.getSVGFilterList()

    var totalList = []

    if (svgFilterList.length) {
      totalList = [
        ...list,
        { title: '-------' , value: ''},
        ...svgFilterList
      ]
    } else {
      totalList = [
        ...list
      ]
    }

    return totalList.map(it => {
      var {title, value} = it;
      
      return `<option value='${value}'>${title}</option>`
    })
  }

  getSpec(filterType) {
    return specList[filterType];
  }

  makeDropShadowFilterTemplate(spec, filter, index) {
    return `
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
                  value="${filter[key].value}" units="${spec[key].units.join(',')}" onchange="changeRangeEditor" />
            </div>`;
        }).join('')}
      </div>
    `;
  }

  getSVGFilterList () {
     
    var current = editor.selection.currentProject;
    var arr = [] 

    if (current) {
      arr = current.svgfilters
        .map(it => {
          return {
            title : `svg - #${it.id}`,
            value: it.id
          }
        })
    }

    return arr
  }

  makeOneFilterEditor (index, filter, spec) {

    if (filter.type === 'svg') {

      var options = ''
      
      var current = editor.selection.currentProject;

      if (current) {
        options = current.svgfilters.map(it => it.id)
        options = options.length ? ',' + options.join(',') : '';
      }

      return `
      <SelectEditor 
        ref='$select${index}' 
        key="${index}" 
        label="SVG Filter"
        value="${filter.value}" 
        options="${options}"
        onchange="changeRangeEditor"  />`
    }

    return `<RangeEditor 
                ref='$range${index}_${filter.type}' 
                key="${index}" 
                value="${filter.value}" 
                units="${spec.units.join(',')}" 
                onchange="changeRangeEditor" />`
  }

  makeOneFilterTemplate(spec, filter, index) {

    var subtitle = filter.type === 'svg' ? ` - <span class='svg-filter-edit' data-index="${index}">${filter.value}</span>` : ''; 

    return `
      <div class="filter-item" data-index="${index}">
        <div class="title" draggable="true" data-index="${index}">
          <label>${spec.title}${subtitle}</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
        ${filter.type != 'svg' ? `
          <div class="filter-ui">
            ${this.makeOneFilterEditor(index, filter, spec)}
          </div>
        `: ''}
        
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
    var value = this.state.filters.join(' ');

    this.parent.trigger(this.props.onchange, value)
  }

  makeFilter(type, opt = {}) {
    return Filter.parse({ ...opt, type });
  }

  [CLICK('$filterList .svg-filter-edit')] (e) {
    var index = +e.$delegateTarget.attr('data-index');

    var filter = this.state.filters[index];

    var project = editor.selection.currentProject; 
    
    if (project) {
      var svgfilterIndex = project.getSVGFilterIndex(filter.value);

      this.trigger('openSVGFilterPopup', svgfilterIndex);

    }
  }


  [EVENT('openSVGFilterPopup')](index) {
    var currentProject = editor.selection.currentProject || { svgfilters: [] } 

    var svgfilter = currentProject.svgfilters[index];

    this.emit("showSVGFilterPopup", {
        changeEvent: 'changeSVGFilterRealUpdate',
        index,
        filters: svgfilter.filters 
    });
  }


  [EVENT('changeSVGFilterRealUpdate')] (params) {
    var project = editor.selection.currentProject

    if (project) {
      project.setSVGFilterValue(params.index, {
        filters: params.filters
      });
  
      this.emit('refreshSVGFilterAssets');
      this.emit('refreshSVGArea');
    }
  }


  [EVENT("add")](filterType) {

    if (filterType === 'svg') {

      this.emit('add.assets.svgfilter', (index, id) => {
        this.state.filters.push(this.makeFilter(filterType, {
          value: id
        }))

        this.refresh();
    
        this.modifyFilter()


        this.trigger('openSVGFilterPopup', index);

      })
    } else {

      this.state.filters.push(this.makeFilter(filterType))

      this.refresh();
  
      this.modifyFilter()
    }

  }  

  [CLICK("$add")]() {
    var filterType = this.refs.$filterSelect.value;

    this.trigger('add', filterType)
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

  [EVENT('refreshCanvas') + DEBOUNCE(1000) ] () {
    // svg 필터 옵션만 변경한다. 
    this.load('$filterSelect')
  }

  [EVENT('refreshSVGArea') + DEBOUNCE(1000)] () {
    this.load('$filterSelect');
    this.load('$filterList');
  }
}
