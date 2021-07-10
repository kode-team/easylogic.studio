import { LOAD, DOMDIFF, CLICK, SUBSCRIBE } from "el/base/Event";

import artboardSize from "el/editor/preset/artboards/artboard.size";
import BaseProperty from "el/editor/ui/property/BaseProperty";


export default class ArtBoardSizeProperty extends BaseProperty {

  getClassName() {
    return 'artboard-size-list'
  }

  [SUBSCRIBE('refreshSelection')] () {
    this.refreshShow(['artboard']);
  }

  initState() {
    return {
      selectedIndex: 0,
    }
  }

  getTitle() {
    return "ArtBoard Preset";
  }

  getTools() {

    var categories = artboardSize.map((it,index) => {
      return {category: it.category, index}
     })

    return /*html*/`
      <object refClass="SelectEditor"  ref='$select' value="${categories[0].category}" options="${categories.map(it => it.category).join(',')}" onchange='changeSizeIndex'/>
    `
  }

  [SUBSCRIBE('changeSizeIndex')] (key, value) {
    var selectedIndex = this.state.selectedIndex;
    artboardSize.forEach((it, index) => {
      if (it.category === value) {
        selectedIndex = index; 
      }
    })

    this.state.selectedIndex = selectedIndex;

    this.refresh();
  }

  getBody() {
    return /*html*/`
      <div class='artboard-size-item' ref='$list'></div>
    `;
  }

  makeDevice (device) {
    return /*html*/`
      <div class='device-item' data-size='${device.size}'>
        <div class='title'>${device.device}</div>
        <div class='size'>${device.size}</div>
      </div>
    `
  }

  [CLICK('$list .device-item')] (e) {
    var size = e.$dt.attr('data-size');

    this.emit('resizeArtBoard', size);
  }

  makeGroup (group) {
    return /*html*/`
      <div class='group-item'>
        <div class='title'>${group.group}</div>
      </div>
      <div class='devices'>
        ${group.devices.map(device => this.makeDevice(device)).join('')}
      </div>
    `
  }

  makeCategory (category) {
    return /*html*/`
      <div class='category'>
        <div class='title'>${category.category}</div>
      </div>
      <div class='groups'>
        ${category.groups.map(group => this.makeGroup(group)).join('')}
      </div>
    `
  }

  [LOAD('$list') + DOMDIFF] () {
    var category = artboardSize[this.state.selectedIndex]
    return category.groups.map(group => this.makeGroup(group))
  }
}