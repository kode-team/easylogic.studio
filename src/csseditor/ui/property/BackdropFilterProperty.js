import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK,
} from "../../../util/Event";

import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";



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

export default class BackdropFilterProperty extends BaseProperty {

  getTitle() {
    return 'Backdrop Filter' 
  }

  getBody() {
    return `<div class='property-item full filter-property' ref='$body'></div>`;
  }

  getTools() {
    return `
      <select ref="$filterSelect">      
      </select>
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `
  }
  

  [CLICK("$add")]() {
    var filterType = this.refs.$filterSelect.value;

    this.children.$filterEditor.trigger('add', filterType)
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


  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current['backdrop-filter'];

    return `<FilterEditor ref='$filterEditor' value='${value}' hide-label="true" onchange='changeFilterEditor' />`
  }

  [EVENT('changeFilterEditor')] (filter) {

    editor.selection.reset({ 
      'backdrop-filter' : filter 
    })

    this.emit("refreshSelectionStyleView");

  }


  [EVENT('refreshCanvas') + DEBOUNCE(1000) ] () {
    // svg 필터 옵션만 변경한다. 
    this.load('$filterSelect')
  }
}
