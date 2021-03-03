import { isFunction, clone, OBJECT_TO_CLASS, mapjoin, keyMapJoin, repeat } from "@core/functions/func";
import icon from "@icon/icon";
import {
  LOAD,
  CLICK,
  POINTERSTART,
  MOVE,
  END,
  DRAGOVER,
  PREVENT,
  DROP,
  DRAGSTART
} from "@core/Event";
import UIElement, { EVENT } from "@core/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";

import SelectEditor from "./SelectEditor";
import TextEditor from "./TextEditor";
import NumberRangeEditor from "./NumberRangeEditor";
import InputArrayEditor from "./InputArrayEditor";
import { SVGFilter, SVGFilterSpecList } from "@property-parser/SVGFilter";
import FuncFilterEditor from "./FuncFilterEditor";
import { Length } from "@unit/Length";
import Dom from "@core/Dom";
import PathStringManager from "@parser/PathStringManager";
import ColorMatrixEditor from "./ColorMatrixEditor";
import svgFilterPreset from "./svg-filter-preset";
import ImageSelectEditor from "./ImageSelectEditor";
import BlendSelectEditor from "./BlendSelectEditor";

const filterTypes = [
  {label: 'GRAPHIC REFERENCES', items : [
    {label: 'Source Graphic', value:"SourceGraphic"},
    {label: 'Source Alpha', value:"SourceAlpha"},
    {label: 'Background Image', value:"BackgroundImage"},
    {label: 'Background Alpha', value:"BackgroundAlpha"},
    {label: 'Fill Paint', value:"FillPaint"},                
    {label: 'Stroke Paint', value:"StrokePaint"},
  ]},
  {label: 'SOURCES', items : [
    {label: 'Flood', value:"Flood"},
    {label: 'Turbulence', value:"Turbulence"},
    {label: 'Image', value:"Image"}
  ]},  
  {label: 'MODIFIER', items : [
    {label: 'Color Matrix', value:"ColorMatrix"},
    {label: 'Saturate', value:"Saturate"},
    {label: 'HueRotate', value:"HueRotate"},
    {label: 'LuminanceToAlpha', value:"LuminanceAlpha"},
    {label: 'Drop Shadow', value:"DropShadow"},
    {label: 'Morphology', value:"Morphology"},
    {label: 'Convolve Matrix', value:"ConvolveMatrix"},
    {label: 'Offset', value:"Offset"},
    {label: 'Gaussian Blur', value:"GaussianBlur"},
    {label: 'Tile', value:"Tile"}
  ]},    
  {label: 'LIGHTING', items : [
    {label: 'Specular Lighting', value:"SpecularLighting"},
    {label: 'Diffuse Lighting', value:"DiffuseLighting"},
    {label: 'Point Light', value:"PointLight"},
    {label: 'Spot Light', value:"SpotLight"},
    {label: 'Distant Light', value:"DistantLight"}
  ]},     
  {label: 'COMBINERS', items : [
    {label: 'Blend', value:"Blend"},
    {label: 'Composite', value:"Composite"},
    {label: 'Merge', value:"Merge"},
    {label: 'DisplacementMap', value:"DisplacementMap"}
  ]},        
]

const SVGFilterTemplateList = [
  {
    label: 'Template', items : [
      {label: 'Grayscale', value: 'grayscale'},
      {label: 'Shadow', value: 'shadow'},
      {label: 'Inner Shadow', value: 'innerShadow'},      
      {label: 'Stroke', value: 'stroke'},
      {label: 'Dancing Stroke', value: 'dancingStroke'}
    ]
  }
];

function getIcon(type) {
  switch(type) {
  case 'SpecularLighting': return icon.specular;
  case 'DiffuseLighting': return icon.diffuse;
  case 'SourceGraphic': 
  case 'SourceAlpha': 
    return icon.image;
  case 'BackgroundImage':
  case 'BackgroundAlpha':
    return icon.outline_image;
  case 'Flood': return icon.palette;
  case 'Image': return icon.landscape;
  case 'GaussianBlur': return icon.blur;
  case 'ColorMatrix': return icon.blur_linear;
  case 'Turbulence': return icon.waves;
  case 'Saturate': return icon.vintage;
  case 'HueRotate': return icon.looks;
  case 'LuminanceAlpha': return icon.opacity;
  case 'DropShadow': return icon.shadow;
  case 'Morphology': return icon.broken_image;
  case 'ConvolveMatrix': return icon.camera_roll;
  case 'Offset': return icon.transform;
  case 'Tile': return icon.view_comfy;
  case 'Blend': return icon.gradient;
  case 'Composite': return icon.merge;
  case 'Merge': return icon.settings_input_component;
  case 'DisplacementMap': return icon.texture;
  }

  return ''; 
}


function getSourceTypeString(type) {
  switch(type) {
  case 'SourceGraphic': 
  case 'SourceAlpha': 
  case 'BackgroundImage':
  case 'BackgroundAlpha':
  case 'FillPaint':
  case 'StrokePaint':
    return 'graphic';    

  case 'Flood': 
  case 'Turbulence':   
  case 'Image': 
    return 'source';
  case 'GaussianBlur': 
  case 'ColorMatrix': 
  case 'Saturate': 
  case 'HueRotate': 
  case 'LuminanceAlpha': 
  case 'DropShadow': 
  case 'Morphology': 
  case 'ConvolveMatrix': 
  case 'Offset': 
  case 'Tile': 
    return 'modifier';    
  case 'SpecularLighting':
  case 'DiffuseLighting':
  case 'SpotLight':
  case 'PointLight':
  case 'DistantLight':
    return 'lighting';            
  case 'Blend': 
  case 'Composite': 
  case 'Merge': 
  case 'DisplacementMap': 
    return 'combiner';
  }

  return ''; 
}


const width = 40; 
const half_height = 20; 

const connectedXAxis = {
  "1" : [ width + 5 ]
}

const connectedYAxis = {
  "1" : [ half_height ]
}

const inXAxis = {
  "1": [ -7 ] ,
  "2": [ -7] ,
  "3": [ -7] ,  
  "4": [ -7] ,    
  "5": [ -7]  
}

let inYAxis = {
  "1": [0] ,
  "2": [-7, 7] ,
  "3": [-14, 0, 14] ,  
  "4": [-21, -7, 7, 21] ,    
  "5": [-28, -14, 0, 14, 28]
}

Object.keys(inYAxis).forEach(len => {
  inYAxis[len] = inYAxis[len].map(it => it + half_height)
})





export default class SVGFilterEditor extends UIElement {



  components() {
    return {
      BlendSelectEditor,
      ColorMatrixEditor,
      InputArrayEditor,
      NumberRangeEditor,
      RangeEditor,
      ColorViewEditor,
      SelectEditor,
      TextEditor,
      FuncFilterEditor,
      ImageSelectEditor
    }
  }

  makeFilterSelect () {
    return /*html*/`
  
    <div class='filter-item-list' ref="$filterSelect">
  
      ${mapjoin(filterTypes, f => {
        return /*html*/`
          <div class='group' label="${this.$i18n(f.label)}">
            ${mapjoin(f.items, i => {
              return /*html*/ `
                <div class='item' draggable="true" value="${i.value}">
                  <span class='icon'>${getIcon(i.value)}</span>
                  ${this.$i18n(i.label)}
                </div>
                `
            })}
          </div>
        `
      })}
    </div>
    `
  }
  
  
  makeFilterTemplateSelect () {
    return /*html*/`
  
    <div class='filter-item-list' ref="$filterTemplateSelect">
  
      ${mapjoin(SVGFilterTemplateList, f => {
        return /*html*/`
          <div class='group' label="${this.$i18n(f.label)}">
            ${mapjoin(f.items, i => {
              return /*html*/ ` <div class='item' draggable="true" value="${i.value}">${this.$i18n(i.label)}</div>`
            })}
          </div>
        `
      })}
    </div>
    `
  }
  

  initState() {
    var filters = this.parseFilter(this.props.value || [])

    return {
      filters,
      selectedTabIndex: 1,
      selectedIndex: -1,
      selectedFilter: null
    }
  }



  template() {
    return /*html*/`
      <div class='svg-filter-editor filter-list'>
        <div class='left'>
          <div class="tab number-tab" ref="$tab">
            <div class="tab-header full" ref="$header">
              <div class="tab-item selected" data-value="1" title='Item'>
                <label class='icon'>${this.$i18n('svg.filter.editor.tab.filter')}</label>
              </div>
              <div class="tab-item" data-value="2" title="Preset">
                <label class='icon'>${this.$i18n('svg.filter.editor.tab.preset')}</label>
              </div>
              <div class="tab-item" data-value="3" title="Asset">
                <label class='icon'>${this.$i18n('svg.filter.editor.tab.asset')}</label>
              </div>
            </div>
            <div class="tab-body">
              <div class="tab-content selected" data-value="1">
                ${this.makeFilterSelect()}
              </div>
              <div class="tab-content" data-value="2">
                ${this.makeFilterTemplateSelect()}
              </div>
                     
            </div>
          </div>
        </div>
        <div  class='center'>
          <div class='graph'>
            <div class='drag-line-panel' ref='$dragLinePanel'></div>          
            <div class='connected-line-panel' ref='$connectedLinePanel'></div>
            <div class='graph-panel' ref='$graphPanel' droppable="true"></div>
          </div>
        </div>
        <div class='right'>
          <div class='filter-list' ref='$filterList'></div>
        </div>
      </div>`;
  }


  [CLICK("$header .tab-item:not(.empty-item)")](e) {
    var selectedTabIndex = +e.$dt.attr('data-value')
    if (this.state.selectedTabIndex === selectedTabIndex) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedTabIndex}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedTabIndex}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedTabIndex }, false);
  }  

  [DRAGSTART('$filterSelect .item')] (e) {
    var filter = e.$dt.attr('value');

    e.dataTransfer.setData('filter/type', filter);
  }

  [DRAGOVER('$connectedLinePanel') + PREVENT] () {}
  [DROP('$connectedLinePanel') + PREVENT] (e) {

    var offset  = {x: e.offsetX, y: e.offsetY  }

    var filterType = e.dataTransfer.getData('filter/type')

    this.makeFilterNode(filterType, { bound: offset })
  }

  makeFilterNode  (filterType, opt = {}) {
    this.state.filters.push(this.makeFilter(filterType, opt))
    this.state.selectedIndex = this.state.filters.length - 1; 
    this.state.selectedFilter = this.state.filters[this.state.selectedIndex]; 

    this.refresh();

    this.modifyFilter()    
  }

  applyTemplate  (templateType) {

    var template = svgFilterPreset[templateType]

    if (template) {
      this.setState({
        selectedIndex: -1,
        selectedFilter: null,
        filters: this.parseFilter(template)
      }, false)

      this.refresh()

      this.modifyFilter()    
    }

  }

  getSpec(filterType) {
    return SVGFilterSpecList[filterType];
  }

  makeFilterEditorTemplate (s, filter, key) {

    var objectId = `${filter.type}${key}${this.state.selectedIndex}${Date.now()}`


    if (s.inputType === 'color-matrix') {
      return /*html*/`
        <div>
          <object refClass="ColorMatrixEditor" 
            ref='$colorMatrix${objectId}' 
            label="${s.title}"
            key="${key}"       
            column='${s.column}' 
            values='${filter[key].join(' ')}' 
            onchange="changeRangeEditor"
          />
        </div>
        `
    } else if (s.inputType === 'input-array') {
      return /*html*/`
        <div>
          <object refClass="InputArrayEditor" 
            ref='$inputArray${objectId}' 
            label="${s.title}"
            key="${key}"       
            column-label="R,G,B,A,M",
            row-label="R,G,B,A",
            column='${s.column}' 
            values='${filter[key].join(' ')}' 
            onchange="changeRangeEditor"
          />
        </div>
        `

    } else if (s.inputType === 'blend') {

      return /*html*/`
        <div>
          <object refClass="BlendSelectEditor" 
            ref='$blend${objectId}' 
            label="${s.title}"
            key="${key}"
            value='${filter[key].toString()}' 
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
            <object refClass="SelectEditor"  
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
          <object refClass="TextEditor" 
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
          <object refClass="NumberRangeEditor"  
            ref='$numberrange${objectId}' 
            label="${s.title}" 
            layout='block'             
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
          <object refClass="ColorViewEditor" 
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
          <object refClass="FuncFilterEditor" 
            ref='$funcFilter${objectId}' 
            label="${s.title}" 
            key="${key}"
            value="${filter[key].toString()}" 
            onchange="changeFuncFilterEditor" 
          />
        </div>
      `  
    } else if (s.inputType === 'ImageSelectEditor') {
      return /*html*/`
        <div>
          <object refClass="ImageSelectEditor" 
            ref='$imageSelect${objectId}' 
            label="${s.title}" 
            key="${key}"
            value="${filter[key].toString()}" 
            onchange="changeRangeEditor" 
          />
        </div>
      `            
    }

    return /*html*/`
      <div>
        <object refClass="RangeEditor"  
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
        ${keyMapJoin(spec, (key, value) => {
          return this.makeFilterEditorTemplate(value, filter, key);
        })}

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

  modifyFilter () {

    this.state.filters.forEach(f => {
      if (f.isLight() && f.connected.length) {
        f.connected.forEach(c => {
          this.state.filters.filter(s => s.id === c.id).forEach(lightManager => {
            lightManager.reset({
              lightInfo: f.toLightString()
            })
          })
        })
      }
    })

    this.parent.trigger(this.props.onchange, this.props.key, this.state.filters)
  }

  parseFilter (list = []) {
    return list.map(it => SVGFilter.parse(it))
  }

  makeFilter(type, opt = {}) {
    return SVGFilter.parse({ ...opt, type });
  }


  [CLICK("$filterSelect .item[value]")](e) {
    var filterType = e.$dt.attr('value');

    this.makeFilterNode(filterType);
  }

  [CLICK("$filterTemplateSelect .item[value]")](e) {
    var templateType = e.$dt.attr('value');

    this.applyTemplate(templateType);
  }


  [CLICK("$filterList .filter-menu .del")](e) {
    this.removeFilter(this.state.selectedFilter.id);
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

  [POINTERSTART('$graphPanel .filter-node') + MOVE()  + END()] (e) {
    this.$target = e.$dt;
    this.$point = null; 
    this.pointType = 'object';
    this.pointIndex = 0; 
    var rect = this.refs.$graphPanel.rect();
    this.rect = rect;  

    var index = +this.$target.attr('data-index');    
    this.selectFilter(index);
    this.$target.onlyOneClass('selected');

    var  pointer = Dom.create(e.target);

    if (pointer.hasClass('out')) {
      this.$point = pointer;
      this.pointType = 'out';
      this.pointIndex = 0; 
    } else if (pointer.hasClass('in')) {
      this.$point = pointer;
      this.pointType = 'in'; 
      this.pointIndex = +pointer.attr('data-index');      
    } else {
      var filter = this.state.selectedFilter
      this.startXY = clone(filter.bound);
    }

    if (this.pointType === 'in' || this.pointType === 'out') {
      var inRect = pointer.rect()
      var x = inRect.x - rect.x;
      var y = inRect.y - rect.y;

      var centerX = x + inRect.width/2;
      var centerY = y + inRect.height/2;

      this.startXY = {x: centerX, y: centerY };
    }

    this.startXY.dx = 0
    this.startXY.dy = 0; 

    this.load('$dragLinePanel');

  }

  [LOAD('$dragLinePanel')] () {
    if (this.pointType === 'in' || this.pointType === 'out') {
      var {x, y, dx, dy } = this.startXY;
      return /*html*/`
      <svg>
        <path 
          class="drag-line"
          fill="transparent"
          stroke-width="1"
          d="
            M${x},${y}
            L${x + dx},${y + dy} 
            Z
          "
        />
      </svg>
      `
    } else {
      return ''; 
    }
  }

  makeConnectedPath (points) {

    var manager = new PathStringManager();

    var first = points[0];
    var last = points[points.length-1]

    if (!first) return '';
    if (!last) return '';

    var dist = Math.abs(first.x - last.x)/2;

    manager
    .M(first)
    .C({x: first.x + dist, y: first.y}, {x: last.x - dist, y: last.y}, last)

    return manager.d;
  }

  createPath (sourceItem, connectedInfo) {
    
    if (connectedInfo.path) {
      return connectedInfo.path; 
    }

    var sourceX = sourceItem.bound.x + connectedXAxis['1'][0]; 
    var sourceY = sourceItem.bound.y + connectedYAxis['1'][0]; 

    var target = this.state.filters.map((it, index) => {
      return {it, index}
    }).find(it => {
      if (!it) return false; 
      if (!it.it) return false;       
      return it && it.it.id === connectedInfo.id
    });


    var len = `${target.it.getInCount()}`;
    var source = target.it.in.map((it, index) => {
      return { it, index}
    }) .find((it) => {
      if (!it) return false; 
      if (!it.it) return false; 
      return it.it.id === sourceItem.id
    });
    
    if (!source) {
      return [] 
    }

    var index = source.index;
    var targetX = target.it.bound.x + inXAxis[len][0];
    var targetY = target.it.bound.y + inYAxis[len][index];    

    return [{x: sourceX, y: sourceY}, {x: targetX, y: targetY}]
  }

  [LOAD('$connectedLinePanel')] () {

    return /*html*/`
      <svg>
        ${this.state.filters.map(it => {
          return it.connected.map(connectedItem => {

            var path = this.createPath(it, connectedItem);
            var sourceType = getSourceTypeString(it.type);

            return /*html*/`
              <path 
                class="connected-line"
                data-source-type="${sourceType}"
                d="${this.makeConnectedPath(path)}"
              />

              ${path.length && /*html*/`
                <circle 
                  data-source-type="${sourceType}"
                  data-target-id="${connectedItem.id}"
                  data-source-id="${it.id}"
                  class="connected-remove-circle"
                  cx="${(path[0].x + path[1].x) / 2}"
                  cy="${(path[0].y + path[1].y) / 2}"
                />
              `}
              
            `
          }).join('');
        }).join('')}
      </svg>
    `
  }

  [CLICK('$connectedLinePanel .connected-remove-circle')] (e) {
    var  [tid, sid] = e.$dt.attrs('data-target-id', 'data-source-id');

    var filters = this.state.filters; 
    filters.filter(it => it.id === sid).forEach(it => {
      it.connected = it.connected.filter(c => c.id != tid);
    });

    filters.filter(it => it.id === tid).forEach(it => {
      it.in = it.in.map(inObject => {
        if (inObject && inObject.id ==  sid) {
          return null; 
        }

        return inObject; 
      })
    });

    this.refresh();

    this.modifyFilter();    
  }

  getCenterXY ($target) {
    var inRect = $target.rect()
    var x = inRect.x - this.rect.x;
    var y = inRect.y - this.rect.y;

    var centerX = x + inRect.width/2;
    var centerY = y + inRect.height/2;

    return {x: centerX, y: centerY}
  }

  end (dx, dy) {

    if (this.pointType === 'in'|| this.pointType === 'out') {

      this.startXY.dx = dx; 
      this.startXY.dy = dy; 
      var filter = this.state.selectedFilter;

      var e = this.$config.get('bodyEvent')      

      var $target = Dom.create(e.target);
      var $targetNode = $target.closest('filter-node');
      
      if (this.pointType === 'out') {

        if ($target.hasClass('in')) {
          var targetFilter = this.state.filters[+$targetNode.attr('data-index')]
          if (targetFilter) {

            if (!targetFilter.hasLight() && filter.isLight()) {
              // light 계열은 lighting 에만 갈 수 있음.  
            } else {
              var targetIndex = +$target.attr('data-index');
              if (!targetFilter.in[targetIndex]) {
                targetFilter.setIn(targetIndex, filter);
                filter.setConnected(targetFilter)
              }

            }

          }
        }
      } else if (this.pointType === 'in') {
        if ($target.hasClass('out'))  {        
          var targetFilter = this.state.filters[+$targetNode.attr('data-index')]
          if (targetFilter) {

            if (filter.hasLight() && !targetFilter.isLight()) {
              // lighting  는 light 와  연결된다. 
            } else {
              if (!filter.in[this.pointIndex]) {
                filter.setIn(this.pointIndex, targetFilter);
                targetFilter.setConnected(filter)
              }

            }
                      
          }
        }
      }

      this.pointType = '';
  
    }

    this.load('$dragLinePanel');
    this.load('$connectedLinePanel');

    this.modifyFilter();    
  }

  move (dx, dy) {


    var filter = this.state.selectedFilter;
    if (filter) {
      this.startXY.dx = dx; 
      this.startXY.dy = dy; 

      if (this.pointType === 'in') {
        this.load('$dragLinePanel')
      } else if (this.pointType === 'out') {
        this.load('$dragLinePanel')
      } else {

        filter.reset({
          bound: { x: this.startXY.x + dx, y : this.startXY.y + dy }
        })
  
        this.$target.css({
          left: Length.px(filter.bound.x),
          top: Length.px(filter.bound.y),
        })
        
        this.load('$connectedLinePanel');
      }

    }

  }

  makeGraphPanel() {

    return this.state.filters.map((it, index) => {

      return /*html*/`
        <div class='filter-node ${OBJECT_TO_CLASS({
          'selected': index ===  this.state.selectedIndex
        })}' data-type="${it.type}" data-index="${index}" data-filter-id="${it.id}" style='left: ${it.bound.x}px;top: ${it.bound.y}px;'>
          <div class='label'>${this.$i18n(it.type)}</div>
          <div class='remove'>${icon.close}</div>
          <div class='preview' data-source-type="${getSourceTypeString(it.type)}" data-filter-type='${it.type}'>${getIcon(it.type)}</div>
          <div class='in-list'>
            ${repeat(it.getInCount()).map((itIn, inIndex) => {
              return /*html*/`<div class='in' data-index='${inIndex}'></div>`
            }).join('')}
          </div>
          
          <div class='out' data-index="0">${icon.chevron_right}</div>
          ${it.hasLight() ? /*html*/`<div class='light'  data-index="0"></div>` : ''}
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

  removeFilter (id) {

    var filters  = this.state.filters.filter(it => it.id != id);
    filters.forEach(it => {
      it.connected = it.connected.filter(c => c.id != id);
      it.in = it.in.filter(c => c.id != id);
    })

    if (this.state.selectedFilter.id === id) {
      this.state.selectedFilter = null; 
      this.state.selectedIndex = -1; 
    }

    this.setState({
      filters
    })

    this.modifyFilter();
  }

  [CLICK('$graphPanel .filter-node .remove')] (e) {
    var $target = e.$dt.closest('filter-node');
    var index = +$target.attr('data-index');
    var f = this.state.filters[index]

    this.removeFilter(f.id);
  }
}
