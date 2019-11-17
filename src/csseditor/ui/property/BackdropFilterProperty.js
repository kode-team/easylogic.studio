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
    return editor.i18n('backdrop.filter.property.title');
  }


  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'backdrop-filter';
  }


  getBody() {
    return /*html*/`<div class='full filter-property' ref='$body'></div>`;
  }

  getTools() {
    return /*html*/`
      <select ref="$filterSelect"></select>
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

    return /*html*/`<FilterEditor ref='$filterEditor' value='${value}' hide-label="true" onchange='changeFilterEditor' />`
  }

  [EVENT('changeFilterEditor')] (filter) {

    editor.selection.reset({ 
      'backdrop-filter' : filter 
    })

    this.emit("refreshSelectionStyleView");

  }


  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot(['project', 'artboard'])
  }  

  [EVENT('refreshCanvas') + DEBOUNCE(1000) ] () {
    
    this.load('$filterSelect')
  }
}
