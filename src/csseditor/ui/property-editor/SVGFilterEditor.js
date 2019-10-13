import { isFunction, clone, OBJECT_TO_CLASS } from "../../../util/functions/func";
import icon from "../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT,
  BIND,
  POINTERSTART,
  MOVE,
  END
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
import { OffsetSVGFilter } from "../../../editor/svg-property/svg-filter/OffsetSVGFilter";
import { Length } from "../../../editor/unit/Length";

var specList = {
  Offset: OffsetSVGFilter.spec,
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
      filters,
      selectedIndex: -1,
      selectedFilter: null
    }
  }

  template() {
    return /*html*/`
      <div class='svg-filter-editor filter-list'>
        <div class='left'>
          <div class='label' >
              <label>${this.props.title || ''}</label>
              <div class='tools'>
                <select ref="$filterSelect">
                  <optgroup label='GRAPHIC REFERENCES'>
                    <option value='SourceGraphic'>Source Graphic</option>
                    <option value='SourceAlpha'>Source Alpha</option>
                    <option value='BackgroundImage'>Background Image</option>
                    <option value='BackgroundAlpha'>Background Alpha</option>
                    <option value='FillPaint'>Fill Paint</option>
                    <option value='StrokePaint'>Stroke Paint</option>
                  </optgroup>
                  <optgroup label="SOURCES">
                    <option value='Flood'>Flood</option>
                    <option value='Turbulence'>Turbulence</option>
                    <option value='Image'>Image</option>
                  </optgroup>
                  <optgroup label='MODIFIER'>
                    <option value="ColorMatrix">Color Matrix</option>
                    <option value="Morphology">Morphology</option>
                    <option value="ConvolveMatrix">Convolve Matrix</option>
                    <option value="Offset">Offset</option>
                    <option value="GaussianBlur">Gaussian Blur</option>
                    <option value="Tile">Tile</option>
                  </optgroup>
                  <optgroup label="LIGHTING">
                    <option value="SpecularLighting">Specular Lighting</option>
                    <option value="DiffuseLighting">Diffuse Lighting</option>
                    <option value="PointLight">Point Light</option>
                    <option value="SpotLight">Spot Light</option>
                    <option value="DistanceLight">Distance Light</option>
                  </optgroup>
                  <optgroup label="COMBINERS">
                    <option value="Composite">Composite</option>
                    <option value="Merge">Merge</option>
                    <option value="DisplacementMap">Displacement Map</option>
                  </optgroup>
                </select>
                <button type="button" ref="$add" title="add Filter">${icon.add} ${this.props.title ? '' : 'Add'}</button>
              </div>
          </div>
          <div class='graph'>
            <div class='graph-panel' ref='$graphPanel'></div>
          </div>
        </div>
        <div class='right'>
          <div class='filter-list' ref='$filterList'></div>
        </div>
      </div>`;
  }

  getSpec(filterType) {
    return specList[filterType];
  }

  makeFilterEditorTemplate (s, filter, key) {

    var objectId = `${filter.type}${key}${this.state.selectedIndex}${Date.now()}`


    if (s.inputType === 'input-array') {
      return /*html*/`
        <div>
          <InputArrayEditor 
            ref='$inputArray${objectId}' 
            label="${s.title}"
            key="${key}"       
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
          value="${filter[key].toString()}" 
          units="${s.units.join(',')}" 
          onchange="changeRangeEditor" 
        />
      </div>
    `
  }

  makeOneFilterTemplate(spec, filter) {
  return /*html*/`
    <div class="filter-item">
      <div class="title">
        <label>${filter.type}</label>
        <div class="filter-menu">
          <button type="button" class="del">${icon.remove}</button>
        </div>
      </div>
      <div class="filter-ui">
        ${Object.keys(spec).map(key => {
          return this.makeFilterEditorTemplate(spec[key], filter, key);
        }).join(' ')}

      </div>
    </div>
  `;
  }

  makeFilterTemplate(filter) {
    return this.makeOneFilterTemplate(
      this.getSpec(filter.type),
      filter
    );
  }

  [LOAD("$filterList")]() {

    if (this.state.selectedFilter  && this.state.selectedFilter.isSource() === false) {
      return this.makeFilterTemplate(this.state.selectedFilter);
    }

    return '';
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


  [CLICK("$add")]() {
    var filterType = this.refs.$filterSelect.value;

    this.state.filters.push(this.makeFilter(filterType))
    this.state.selectedIndex = this.state.filters.length - 1; 
    this.state.selectedFilter = this.state.filters[this.state.selectedIndex]; 

    this.refresh();

    this.modifyFilter()
  }

  [CLICK("$filterList .filter-menu .del")](e) {
    this.state.filters.splice(this.state.selectedIndex, 1);
    this.state.selectedIndex = -1; 
    this.state.selectedFilter = null; 

    this.refresh();

    this.modifyFilter()
  }

  [LOAD('$graphPanel')] () {
    return this.makeGraphPanel();
  }

  selectFilter (index) {
    this.setState({
      selectedIndex: index,
      selectedFilter: this.state.filters[index]
    }, false)
    this.load('$filterList')
  }

  [POINTERSTART('$graphPanel .filter-node') + MOVE()] (e) {
    this.$target = e.$delegateTarget;
    var index = +this.$target.attr('data-index');
    
    this.selectFilter(index);
    this.startXY = clone(this.state.selectedFilter.bound);
    this.$target.onlyOneClass('selected');
  }

  move (dx, dy) {
    var filter = this.state.selectedFilter;
    if (filter) {

      filter.reset({
        bound: { x: this.startXY.x + dx, y : this.startXY.y + dy }
      })

      this.$target.css({
        left: Length.px(filter.bound.x),
        top: Length.px(filter.bound.y),
      })
    }

  }

  makeGraphPanel() {

    return this.state.filters.map((it, index) => {

      return /*html*/`
        <div class='filter-node ${OBJECT_TO_CLASS({
          'selected': index ===  this.state.selectedIndex
        })}' data-type="${it.type}" data-index="${index}" data-filter-id="${it.id}" style='left: ${it.bound.x}px;top: ${it.bound.y}px;'>
          <div class='label'>${it.type}</div>
          <div class='preview'></div>
          <div class='in-list'>
            <div class='in'></div>
          </div>
          
          <div class='out'></div>
        </div>
      `
    })
  }

  [EVENT('changeSVGFilterColorViewEditor')] (key, color, params) {
    this.trigger('changeRangeEditor', key, color, params)
  }


  [EVENT('changeFuncFilterEditor')] (key, value) {
    var filter =  this.state.selectedFilter;
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
    this.modifyFilter();
  }    

  [EVENT('changeRangeEditor')] (key, value) {
    var filter =  this.state.selectedFilter;
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
    this.modifyFilter();
  }  

  [EVENT('changeTextEditor')] (key, value) {
    var filter =  this.state.selectedFilter;
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
    this.modifyFilter();
  }
}
