import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK, DEBOUNCE,
} from "../../../util/Event";

import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { filter_list } from "../../../editor/util/Resource";


const i18n = editor.initI18n('filter.property');

export default class FilterProperty extends BaseProperty {

  getTitle () {
    return i18n('title');
  }


  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'filter';
  }


  getTitleClassName() {
    return 'filter'
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
    var list = filter_list.map(it => { 
      return {title: i18n(it), value: it}
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

    this.emit('SET_ATTRIBUTE', { 
      filter 
    })
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot('project')
  }

  [EVENT('refreshSVGArea') + DEBOUNCE(1000)] () {
    this.load('$filterSelect');
  }
}
