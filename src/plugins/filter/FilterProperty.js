
import {
  LOAD, CLICK, DEBOUNCE, SUBSCRIBE,
} from "el/base/Event";


import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { filter_list } from "./util";

export default class FilterProperty extends BaseProperty {

  getTitle () {
    return this.$i18n('filter.property.title');
  }


  hasKeyframe () {
    return true; 
  }

  afterRender() {
    this.show();
  }

  getKeyframeProperty () {
    return 'filter';
  }


  getTitleClassName() {
    return 'filter'
  }

  getBodyClassName() {
    return 'no-padding';
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
      return {title: this.$i18n(`filter.property.${it}`), value: it}
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
     
    var current = this.$selection.currentProject;
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
    var current = this.$selection.current || {} 
    var value = current.filter;

    return /*html*/`
      <div>
        <object refClass="FilterEditor" ref='$filterEditor' key="filter" value='${value}' hide-label='true' onchange='changeFilterEditor' />
      </div>`
  }

  [SUBSCRIBE('changeFilterEditor')] (key, filter) {

    this.command('setAttribute', 'change filter', { 
      [key]: filter 
    })
  }

  [SUBSCRIBE('refreshSelection')] () {
    this.refreshShowIsNot(['project']);
  }

  [SUBSCRIBE('refreshSVGArea') + DEBOUNCE(1000)] () {
    this.load('$filterSelect');
  }
}