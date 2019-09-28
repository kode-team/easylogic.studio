import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, VDOM, CLICK } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";


import SelectEditor from "../property-editor/SelectEditor";
import { Length } from "../../../editor/unit/Length";

export default class ArtBoardSizeProperty extends BaseProperty {
  components() {
    return {
      SelectEditor
    }
  }

  getClassName() {
    return 'artboard-size-list'
  }

  [EVENT('refreshSelection')] () {
    this.refreshShow('artboard');
  }

  initState() {
    return {
      selectedIndex: 0,
      sizeList: [
        {
          category: 'Web', 
          groups: [
            { group: 'Landscape', devices: [
              { device: 'Web Small', size: '1024x600' },
              { device: 'Web Medium', size: '1280x800' },
              { device: 'Web Large', size: '1440x900' },
              { device: 'Web X Large', size: '1920x1200' },
            ]},
            {
              group: 'Portrait', devices: [
                { device: 'Web Small', size: '600x1024' },
                { device: 'Web Medium', size: '800x1280' },
                { device: 'Web Large', size: '900x1440' },
                { device: 'Web X Large', size: '1200x1920' },
            ]}
          ]
        },               
        {
          category: 'Apple Devices', 
          groups: [
            { group: 'iphone', devices: [
              { device: 'iPhone 8', size: '375x667' },
              { device: 'iPhone 8 Plus', size: '414x736' },
              { device: 'iPhone SE', size: '320x568' },
              { device: 'iPhone XS', size: '375x812' },
              { device: 'iPhone XR', size: '414x896' },
              { device: 'iPhone XS Max', size: '414x896' }
            ]},
            { group: 'ipad', devices: [
              { device: 'iPad', size: '768x1024' },
              { device: 'iPad Pro', size: '1024x1366' }
            ]},
            { group: 'apple watch', devices: [
              { device: 'Apple Watch 38nm', size: '272x340' },
              { device: 'Apple Watch 40nm', size: '326x394' },
              { device: 'Apple Watch 42nm', size: '313x390' },
              { device: 'Apple Watch 44nm', size: '368x448' }
            ]},
            { group: 'apple tv', devices: [
              { device: 'Apple TV', size: '1920x1080' }
            ]},
            { group: 'MAC', devices: [
              { device: 'Touch Bar', size: '1085x30' },
            ]}                        
          ]
        },
        {
          category: 'Android Devices', 
          groups: [
            { group: 'android mobile', devices: [
              { device: 'Android Mobile', size: '360x640' }
            ]},
            { group: 'android tablet', devices: [
              { device: 'Android Tablet', size: '768x1024' }
            ]}
          ]
        }
      ]
    }
  }

  getTitle() {
    return "Preset";
  }

  getTools() {

    var categories = this.state.sizeList.map((it,index) => {
      return {category: it.category, index}
     })

    return /*html*/`
      <SelectEditor ref='$select' value="${categories[0].category}" options="${categories.map(it => it.category).join(',')}" onchange='changeSizeIndex'/>
    `
  }

  [EVENT('changeSizeIndex')] (key, value) {
    var selectedIndex = this.state.selectedIndex;
    this.state.sizeList.forEach((it, index) => {
      if (it.category === value) {
        selectedIndex = index; 
      }
    })

    this.state.selectedIndex = selectedIndex;

    this.refresh();
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow('artboard')

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
    var size = e.$delegateTarget.attr('data-size');

    this.emit('resize.artboard', size);
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

  [LOAD('$list') + VDOM] () {
    var category = this.state.sizeList[this.state.selectedIndex]
    return category.groups.map(group => this.makeGroup(group))
  }


  [EVENT('changeBoardSize')] (key, value) {
    var current = editor.selection.currentArtboard;
    if (current && current.is('artboard')) {

      if (!value.trim()) return;

      var [width, height] = value.split('x')

      width = Length.px(width);
      height = Length.px(height);

      current.reset({ width, height });
      this.emit("refreshElement", current);
    }
  }
}
