
import icon from "../../../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT
} from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";
import { uuidShort } from "../../../../../util/functions/math";



var propertyList = [
  {type: "filter", title: 'FILTER' },
  {type: "clip-path", title: 'CLIP-PATH' }
];

var propertyTitle = {
  'filter': 'FILTER',
  'clip-path': 'CLIP-PATH'
}

export default class SVGPropertyEditor extends UIElement {

  components() {
    return {
      RangeEditor,
      ColorViewEditor
    }
  }

  initState() {
    return {
      properties: JSON.parse(this.props.value)
    }
  }

  template() {
    return `
      <div class='svg-property-editor'>
          <div class='label' >
              <label>${this.props.title || ''}</label>
              <div class='tools'>
                <select ref="$propertySelect">
                  ${propertyList.map(property => {
                    return `<option value='${property.type}'>${property.title}</option>`;
                  }).join('')}
                </select>
                <button type="button" ref="$add" title="add Property">${icon.add} ${this.props.title ? '' : 'Add'}</button>
              </div>
          </div>
          <div class='svg-property-list' ref='$propertyList'></div>
      </div>`;
  }

  makeSVGPropertyTemplate(property, index) {
    return `
      <div class='svg-property-item' data-type='${property.type}' data-index='${index}' draggable="true">
        <div class='title'>
          <div class='type' data-type="${property.type}">${propertyTitle[property.type]}</div>
          <label>${property.name}
            ${property.type === 'clip-path' ? ' - ' + property.value : ''}
          </label>
          <div class='menu'>
            <button type="button" class='del'>${icon.remove2}</button>
          </div>
        </div>
      </div>
    `
  }

  [LOAD("$propertyList")]() {
    return this.state.properties.map((property, index) => {
      return this.makeSVGPropertyTemplate(property, index.toString());
    });
  }

  // svg-property-item 을 통째로  dragstart 를 걸어버리니깐
  // 다른 ui 를 핸들링 할 수가 없어서
  // title  에만 dragstart 거는 걸로 ok ?
  [DRAGSTART("$propertyList .svg-property-item .title")](e) {
    this.startIndex = +e.$delegateTarget.attr("data-index");
  }

  // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
  [DRAGOVER("$propertyList .svg-property-item") + PREVENT](e) {}



  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortFilter(startIndex, targetIndex) {
      this.sortItem(this.state.properties, startIndex, targetIndex);
  }

  [DROP("$propertyList .svg-property-item") + PREVENT](e) {
    var targetIndex = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    this.sortFilter(this.startIndex, targetIndex);

    this.refresh();

    this.modifyFilter()
  }

  modifyFilter () {
    this.parent.trigger(this.props.onchange, this.state.properties)
  }

  [CLICK("$add")]() {
    var type = this.refs.$propertySelect.value;

    this.state.properties.push({ type, name: uuidShort(), value: [] })

    this.refresh();

    this.modifyFilter()
  }

  [CLICK("$propertyList .menu .del")](e) {
    var index = +e.$delegateTarget.attr("data-index");
    this.state.properties.splice(index, 1);

    this.refresh();
  }

  [CLICK('$propertyList .svg-property-item')] (e) {
    var [index, type] = e.$delegateTarget.attrs('data-index', 'data-type')

    this.selectedIndex = +index; 
    this.selectedType = type; 

    var current = this.state.properties[this.selectedIndex]

    if (!current) return; 

    this.emit('showSVGPropertyPopup', {
      changeEvent: 'changeSVGPropertyPopup',
      name: current.name, 
      type: current.type,
      value: current.value
    })
  }

  [EVENT('changeSVGPropertyPopup')] ({name, type, value}) {
    var current = this.state.properties[this.selectedIndex]

    if (current) {
      current.name = name;
      current.type = type; 
      current.value = value; 
      
      this.modifyFilter()
    }
  }

}
