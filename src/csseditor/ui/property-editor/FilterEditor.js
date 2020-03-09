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
import UIElement, { EVENT } from "../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";
import SelectEditor from "./SelectEditor";
import { filter_list } from "../../../editor/util/Resource";

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
    return /*html*/`
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
    var list = filter_list.map(it => { 
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
    return /*html*/`
      <div class="filter-item">
        <div class="title" draggable="true" data-index="${index}">
          <label>${this.$i18n('filter.property.drop-shadow')}</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>

        <div class="filter-ui drop-shadow-color">
          <label>${spec.color.title}</label>
          <ColorViewEditor ref='$dropShadowColorView${index}' params="${index}" value="${filter.color}" onChange="changeDropShadowColor" />
        </div>

        ${["offsetX", "offsetY", "blurRadius"].map(key => {
          return /*html*/`        
            <div class="filter-ui drop-shadow">
                <label>${spec[key].title}</label>

                <RangeEditor 
                  ref='$${key}${index}' 
                  key="${index}" 
                  min="${spec[key].min}"
                  min="${spec[key].max}"
                  params="${key}" 
                  value="${filter[key].value}" units="${spec[key].units.join(',')}" onchange="changeRangeEditor" />
            </div>`;
        }).join('')}
      </div>
    `;
  }

  getSVGFilterList () {
     
    var current = this.$selection.currentProject;
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
      
      var current = this.$selection.currentProject;

      if (current) {
        options = current.svgfilters.map(it => it.id)
        options = options.length ? ',' + options.join(',') : '';
      }

      return /*html*/`
      <SelectEditor 
        ref='$select${index}' 
        key="${index}" 
        label="SVG Filter"
        value="${filter.value}" 
        options="${options}"
        onchange="changeRangeEditor"  />`
    }

    return /*html*/`
      <RangeEditor 
        ref='$range${index}_${filter.type}' 
        key="${index}" 
        min='${spec.min}'
        max='${spec.max}'
        value="${filter.value}" 
        units="${spec.units.join(',')}"   
        onchange="changeRangeEditor" />
      `
  }

  makeOneFilterTemplate(spec, filter, index) {

    var subtitle = filter.type === 'svg' ? /*html*/` - <span class='svg-filter-edit' data-index="${index}">${filter.value}</span>` : ''; 

    return /*html*/`
      <div class="filter-item" data-index="${index}">
        <div class="title" draggable="true" data-index="${index}">
          <label>${this.$i18n('filter.property.' + filter.type)}${subtitle}</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
        ${filter.type != 'svg' ? /*html*/`
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


  [DRAGSTART("$filterList .filter-item .title")](e) {
    this.startIndex = +e.$dt.attr("data-index");
  }


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
    var targetIndex = +e.$dt.attr("data-index");
    var current = this.$selection.current;
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
    var index = +e.$dt.attr('data-index');

    var filter = this.state.filters[index];

    var project = this.$selection.currentProject; 
    
    if (project) {
      var svgfilterIndex = project.getSVGFilterIndex(filter.value);

      this.trigger('openSVGFilterPopup', svgfilterIndex);

    }
  }


  [EVENT('openSVGFilterPopup')](index) {
    var currentProject = this.$selection.currentProject || { svgfilters: [] } 

    var svgfilter = currentProject.svgfilters[index];

    this.emit("showSVGFilterPopup", {
        changeEvent: 'changeSVGFilterRealUpdate',
        index,
        preview: false,
        filters: svgfilter.filters 
    });
  }


  [EVENT('changeSVGFilterRealUpdate')] (params) {
    var project = this.$selection.currentProject

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

      this.emit('addSVGFilterAssetItem', (index, id) => {
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
    var index = +e.$dt.attr("data-index");
    this.state.filters.splice(index, 1);

    this.refresh();

    this.modifyFilter()
  }

  [EVENT("changeDropShadowColor")](key, color, params) {
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

  [EVENT('refreshSVGArea') + DEBOUNCE(1000)] () {
    this.load('$filterSelect');
    this.load('$filterList');
  }
}
