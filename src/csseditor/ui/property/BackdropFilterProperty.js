import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK,
} from "../../../util/Event";

import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { filter_list } from "../../../editor/util/Resource";

const i18n = editor.initI18n('filter.property')

export default class BackdropFilterProperty extends BaseProperty {

  getTitle() {
    return editor.i18n('backdrop.filter.property.title');
  }


  hasKeyframe () {
    return true; 
  }


  getTitleClassName() {
    return 'filter'
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
}
