import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK, DEBOUNCE,
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

export default class FilterProperty extends BaseProperty {

  getTitle () {
    return 'Filter' 
  }


  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'filter';
  }


  getBody() {
    return `<div class='full filter-property' ref='$body'></div>`;
  }

  getTools() {
    return /*html*/`
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
          var id = it.id; 
          return {
            title : `svg - #${id}`,
            value: id
          }
        })
    }

    return arr
  }  

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.filter;

    return /*html*/`<FilterEditor ref='$filterEditor' value='${value}' hide-label='true' onchange='changeFilterEditor' />`
  }

  [EVENT('changeFilterEditor')] (filter) {

    editor.selection.reset({ filter })

    this.emit("refreshSelectionStyleView");

  }

  [EVENT('refreshCanvas') + DEBOUNCE(1000) ] () {
    
    this.load('$filterSelect')
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot('project')
  }

  [EVENT('refreshSVGArea') + DEBOUNCE(1000)] () {
    this.load('$filterSelect');
  }
}
