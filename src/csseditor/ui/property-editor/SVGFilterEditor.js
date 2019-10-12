import { isFunction } from "../../../util/functions/func";
import icon from "../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT
} from "../../../util/Event";
import { editor } from "../../../editor/editor";
import UIElement, { EVENT } from "../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";

import SelectEditor from "./SelectEditor";
import TextEditor from "./TextEditor";
import NumberRangeEditor from "./NumberRangeEditor";
import InputArrayEditor from "./InputArrayEditor";
import { RotaMatrixSVGFilter } from "../../../editor/svg-property/svg-filter/RotaMatrixSVGFilter";
import { MergeSVGFilter } from "../../../editor/svg-property/svg-filter/MergeSVGFilter";
import { GaussianBlurSVGFilter } from "../../../editor/svg-property/svg-filter/GaussianBlurSVGFilter";
import { MorphologySVGFilter } from "../../../editor/svg-property/svg-filter/MorphologySVGFilter";
import { CompositeSVGFilter } from "../../../editor/svg-property/svg-filter/CompositeSVGFilter";
import { TurbulenceSVGFilter } from "../../../editor/svg-property/svg-filter/TurbulenceSVGFilter";
import { DisplacementMapSVGFilter } from "../../../editor/svg-property/svg-filter/DisplacementMapSVGFilter";
import { ColorMatrixSVGFilter } from "../../../editor/svg-property/svg-filter/ColorMatrixSVGFilter";
import { ConvolveMatrixSVGFilter } from "../../../editor/svg-property/svg-filter/ConvolveMatrixSVGFilter";
import { SVGFilter } from "../../../editor/svg-property/SVGFilter";
import { FloodSVGFilter } from "../../../editor/svg-property/svg-filter/FloodSVGFilter";
import { BlendSVGFilter } from "../../../editor/svg-property/svg-filter/BlendSVGFilter";
import { DiffuseLightingSVGFilter } from "../../../editor/svg-property/svg-filter/DiffuseLightingSVGFilter";
import { SpecularLightingSVGFilter } from "../../../editor/svg-property/svg-filter/SpecularLightingSVGFilter";
import { SpotLightSVGFilter } from "../../../editor/svg-property/svg-filter/SpotLightSVGFilter";
import { PointLightSVGFilter } from "../../../editor/svg-property/svg-filter/PointLightSVGFilter";
import { DistanceLightSVGFilter } from "../../../editor/svg-property/svg-filter/DistanceLightSVGFilter";
import { ComponentTransferSVGFilter } from "../../../editor/svg-property/svg-filter/ComponentTransferSVGFilter";
import FuncFilterEditor from "./FuncFilterEditor";

var filterList = [
  'ComponentTransfer',
  'Blend',
  'Flood',
  'RotaMatrix',
  "GaussianBlur",
  'DiffuseLighting',
  'SpecularLighting',
  'SpotLight',
  'PointLight',
  'DistanceLight',
  "Turbulence",
  "DisplacementMap",
  'ColorMatrix',
  'ConvolveMatrix',
  'Morphology',
  'Composite',
  'Merge'
];

var specList = {
  ComponentTransfer: ComponentTransferSVGFilter.spec,
  SpecularLighting: SpecularLightingSVGFilter.spec,
  SpotLight: SpotLightSVGFilter.spec,
  PointLight: PointLightSVGFilter.spec,
  DistanceLight:DistanceLightSVGFilter.spec,  
  DiffuseLighting: DiffuseLightingSVGFilter.spec,
  Blend: BlendSVGFilter.spec,
  RotaMatrix: RotaMatrixSVGFilter.spec,
  Merge: MergeSVGFilter.spec,
  GaussianBlur: GaussianBlurSVGFilter.spec,
  Flood: FloodSVGFilter.spec,
  Morphology: MorphologySVGFilter.spec,
  Composite: CompositeSVGFilter.spec,
  Turbulence: TurbulenceSVGFilter.spec,
  DisplacementMap: DisplacementMapSVGFilter.spec,
  ColorMatrix: ColorMatrixSVGFilter.spec,
  ConvolveMatrix: ConvolveMatrixSVGFilter.spec
}; 

export default class SVGFilterEditor extends UIElement {

  components() {
    return {
      InputArrayEditor,
      NumberRangeEditor,
      RangeEditor,
      ColorViewEditor,
      SelectEditor,
      TextEditor,
      FuncFilterEditor
    }
  }

  initState() {
    var filters = (this.props.value || []).map(it => SVGFilter.parse(it))

    return {
      filters
    }
  }

  template() {
    return /*html*/`
      <div class='svg-filter-editor filter-list'>
          <div class='label' >
              <label>${this.props.title || ''}</label>
              <div class='tools'>
                <select ref="$filterSelect">
                  ${filterList.map(filter => {
                    return `<option value='${filter}'>${filter}</option>`;
                  }).join('')}
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

    var objectId = `${filter.type}${key}${index}`

    if (s.inputType === 'input-array') {
      return /*html*/`
        <div>
          <InputArrayEditor 
            ref='$inputArray${objectId}' 
            label="${s.title}"
            key="${key}"
            params="${index}"            
            column='${s.column}' 
            values='${filter[key].join(' ')}' 
            onchange="changeRangeEditor"
          />
        </div>
        `

    } else if (s.inputType === 'select') {

      var options = s.options

      if (isFunction(s.options)){
        options = s.options(this.state.filters)
      }

      return /*html*/`
        <div>
          <SelectEditor 
            ref='$select${objectId}' 
            label="${s.title}"
            options='${options}' 
            key="${key}"
            params="${index}"
            value='${filter[key].toString()}' 
            onchange="changeRangeEditor"             
          />
        </div>
        `
    } else if (s.inputType === 'text') {
      return /*html*/`
        <div>
          <TextEditor 
            ref='$text${objectId}' 
            label="${s.title}"
            key="${key}"
            params="${index}"
            value='${filter[key].toString()}' 
            onchange="changeTextEditor"
          />
        </div>
        `
    } else if (s.inputType === 'number-range') {  
      return /*html*/` 
        <div>
          <NumberRangeEditor 
            ref='$numberrange${objectId}' 
            label="${s.title}" 
            min="${s.min}"
            max="${s.max}"
            step="${s.step}"
            key="${key}" 
            params="${index}" 
            value="${filter[key].toString()}" 
            onchange="changeRangeEditor" 
          />
        </div>
      `
    } else if (s.inputType === 'color') {
      return /*html*/`
        <div>
          <ColorViewEditor 
            ref='$colorview${objectId}' 
            label="${s.title}" 
            key="${key}"
            params="${index}" 
            value="${filter[key].toString()}" 
            onchange="changeSVGFilterColorViewEditor" 
          />
        </div>
      `
    } else if (s.inputType === 'FuncFilter') {
      return /*html*/`
        <div>
          <FuncFilterEditor 
            ref='$funcFilter${objectId}' 
            label="${s.title}" 
            key="${key}"
            params="${index}" 
            value="${filter[key].toString()}" 
            onchange="changeFuncFilterEditor" 
          />
        </div>
      `      
    }

    return /*html*/`
      <div>
        <RangeEditor 
          ref='$range${objectId}' 
          layout='block' 
          calc='false' 
          label="${s.title}" 
          min="${s.min}"
          max="${s.max}"
          step="${s.step}"
          key="${key}" 
          params="${index}" 
          value="${filter[key].toString()}" 
          units="${s.units.join(',')}" 
          onchange="changeRangeEditor" 
        />
      </div>
    `
  }

  makeOneFilterTemplate(spec, filter, index) {
  return /*html*/`
    <div class="filter-item" data-index="${index}">
      <div class="title" draggable="true" data-index="${index}">
        <span class='fold'>${icon.chevron_right}</span>      
        <label>${filter.type}</label>
        <div class="filter-menu">
          <button type="button" class="del" data-index="${index}">${icon.remove2}</button>
        </div>
      </div>
      <div class="filter-ui">

        ${Object.keys(spec).map(key => {
          return this.makeFilterEditorTemplate(spec[key], filter, key, index);
        }).join(' ')}

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

  [DRAGSTART("$filterList .filter-item .title")](e) {
    this.startIndex = +e.$delegateTarget.attr("data-index");
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

  [CLICK('$el .fold')] (e) {
    e.$delegateTarget.closest('filter-item').toggleClass('collapsed');
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

  [EVENT('changeSVGFilterColorViewEditor')] (key, color, params) {
    this.trigger('changeRangeEditor', key, color, params)
  }


  [EVENT('changeFuncFilterEditor')] (key, value, index) {
    var filter =  this.state.filters[+index];
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
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

  updateAllSelect () {
    
    this.state.filters.map((filter, index) => {

      var spec = this.getSpec(filter.type);

      Object.keys(spec).forEach(key => {
        var s = spec[key]; 
        var objectId = `${filter.type}${key}${index}`
        if (s.inputType === 'select') { 
          if (isFunction(s.options)){
            var options = s.options(this.state.filters)

            this.children[`$select${objectId}`].setOptions(options); 

          }
        }
      })

    });
  }

  [EVENT('changeTextEditor')] (key, value, index) {
    var filter =  this.state.filters[+index];
    if (filter) {
      filter.reset({
        [key]: value
      })

      if (key === 'result') {
        this.updateAllSelect();
      }
    }
  
    this.modifyFilter();
  }
}
