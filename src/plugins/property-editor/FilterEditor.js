import icon from "el/editor/icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT,
  DEBOUNCE,
  SUBSCRIBE,
  SUBSCRIBE_SELF
} from "el/sapa/Event";

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
} from "el/editor/property-parser/Filter";
import { filter_list } from "el/editor/util/Resource";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './FilterEditor.scss';
import { variable } from 'el/sapa/functions/registElement';

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

export default class FilterEditor extends EditorElement {

  initialize() {
    super.initialize();

    this.notEventRedefine = true;
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
      <div class='elf--filter-editor filter-list'>
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
        <div class="title drop-shadow" draggable="true" data-index="${index}">
          <label>${this.$i18n('filter.property.drop-shadow')}</label>
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>

        <div class="filter-ui drop-shadow-color">
          <object refClass="ColorViewEditor" 
            label="${this.$i18n(`filter.property.drop-shadow.color`)}" 
            ref='$dropShadowColorView${index}' 
            params="${index}" 
            value="${filter.color}" 
            on-change-value="changeDropShadowColor" />
        </div>

        ${["offsetX", "offsetY", "blurRadius"].map(key => {
          return /*html*/`        
            <div class="filter-ui drop-shadow">
                <object refClass="RangeEditor"  
                  ref='$${key}${index}' 
                  label="${this.$i18n(`filter.property.drop-shadow.${key}`)}"
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
     
    var current = this.$selection.current;
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
      
      var current = this.$selection.current;

      if (current) {
        options = current.svgfilters.map(it => {
          return { value: it.id }
        })
      }

      return /*html*/`
      <object refClass="SelectEditor"  
        ref='$select${index}' 
        key="${index}" 
        label="SVG Filter"
        value="${filter.value}" 
        options=${variable(['', ...options])}
        onchange="changeRangeEditor"  />`
    }

    return /*html*/`
      <object refClass="RangeEditor"  
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

    var isSVG = filter.type === 'svg'
    var title = `${this.$i18n('filter.property.' + filter.type)}`

    return /*html*/`
      <div class="filter-item" data-index="${index}">
        <div class="title" >
          <label draggable="true" data-index="${index}" title="${isSVG ? '' : title}">${title}</label>
          ${filter.type != 'svg' ? /*html*/`
          <div class="filter-ui">
            ${this.makeOneFilterEditor(index, filter, spec)}
          </div>
        `: /*html*/`
          <div>
            <span class='svg-filter-edit' data-index="${index}">${filter.value}</span>
          </div>
        `}          
          <div class="filter-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
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
    return this.state.filters.map((filter, index) => {
      return this.makeFilterTemplate(filter, index.toString());
    });
  }


  [DRAGSTART("$filterList .filter-item .title label")](e) {
    this.startIndex = +e.$dt.attr("data-index");
  }


  [DRAGOVER("$filterList .filter-item .title label") + PREVENT](e) {}



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

    this.parent.trigger(this.props.onchange, this.props.key, value, this.props.params);
  }

  makeFilter(type, opt = {}) {
    return Filter.parse({ ...opt, type });
  }

  [CLICK('$filterList .svg-filter-edit')] (e) {
    var index = +e.$dt.attr('data-index');

    var filter = this.state.filters[index];

    var current = this.$selection.current; 
    
    if (current) {
      var svgfilterIndex = current.getSVGFilterIndex(filter.value?.value?.replace('#', ''));
      this.trigger('openSVGFilterPopup', svgfilterIndex);

    }
  }


  [SUBSCRIBE('openSVGFilterPopup')](index) {
    const current = this.$selection.current || { svgfilters: [] } 
    const svgfilter = current.svgfilters[index];

    this.emit("showSVGFilterPopup", {
        changeEvent: (params) => {
          var current = this.$selection.current;

          if (current) {
            current.setSVGFilterValue(params.index, {
              filters: params.filters
            });

            this.command("setAttributeForMulti", 'change filter', this.$selection.pack('svgfilters', 'filter'));
          }          
        },
        index,
        preview: false,
        filters: svgfilter.filters 
    });
  }

  [SUBSCRIBE("add")](filterType) {

    if (filterType === 'svg') {


      // 비어있는 필터를 하나 생성하고 
      const index = this.$selection.current.createSVGFilter({ 
        filters: []
      })

      // 필터 객체를 구한 다음에 
      const filter = this.$selection.current.svgfilters[index];

      // 내부 리스트를 업데이트 해주고 
      this.state.filters.push(this.makeFilter(filterType, {
        value: filter.id
      }))

      // 화면 다시 그리고 
      this.refresh();
  
      // 필터 리스트 수정하고 
      this.modifyFilter()

      // 편집기를 열게된다. 
      this.trigger('openSVGFilterPopup', index);

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

  [SUBSCRIBE_SELF("changeDropShadowColor")](key, color, params) {
    var index = +params;

    this.state.filters[index].reset({
      color
    });

    this.modifyFilter();

  }

  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value, params) {
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

  // [SUBSCRIBE('refreshSVGArea') + DEBOUNCE(1000)] () {
  //   this.load('$filterSelect');
  //   this.load('$filterList');
  // }
}