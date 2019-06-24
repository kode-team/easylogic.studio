import { CLICK, LOAD } from "../../../../../util/Event";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import { BoxShadow } from "../../../../../editor/css-property/BoxShadow";
import {
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";

export default class BoxShadowEditor extends UIElement {

  initState() {
    return {
      boxShadows: BoxShadow.parseStyle(this.props.value || '')
    }
  }

  template() {
    return `
      <div class="box-shadow-editor" >
        <div class='label' >
            <label>${this.props.title||''}</label>
            <div class='tools'>
              <button type="button" ref="$add" title="add Box Shadow">${icon.add} ${this.props.title ? '': 'Add'}</button>
            </div>
        </div>
        <div class='box-shadow-list' ref='$shadowList'></div>
      </div>
    `;
  }

  [LOAD("$shadowList")]() {
    var arr = this.state.boxShadows.map((shadow, index) => {
      return `
        <div class="shadow-item real" data-index="${index}">
          <div class="color">
            <div class='color-view' style="background-color: ${shadow.color}">
            </div>
          </div>
          <div class="inset" data-value="${shadow.inset}">${icon.check}</div>
          <div class="offset-x">${shadow.offsetX.toString()}</div>
          <div class="offset-y">${shadow.offsetY.toString()}</div>
          <div class="blur-radius">${shadow.blurRadius.toString()}</div>
          <div class="spread-radius">${shadow.spreadRadius.toString()}</div>
          <div class="tools">
            <button type="button" class="remove" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
      `;
    });

    if (arr.length) {
      arr.push(`
      <div class="shadow-item desc">
        <div class="color"></div>      
        <div class="inset" >Inset</div>

        <div class="offset-x">X</div>
        <div class="offset-y">Y</div>
        <div class="blur-radius">Blur</div>
        <div class="spread-radius">Spread</div>
        <div class="tools">
        </div>
      </div>
      `);
    }


    return arr.join('');
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  modifyBoxShadow () {
    var value = this.state.boxShadows.join(', ');

    this.parent.trigger(this.props.onchange, value)
  }


  [CLICK("$add")]() {
    this.state.boxShadows.push(new BoxShadow())

    this.refresh();

    this.modifyBoxShadow()
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    this.state.boxShadows.splice(index, 1);

    this.refresh();

    this.modifyBoxShadow()

    this.emit('hideBoxShadowPropertyPopup')
  }


  [CLICK("$shadowList .shadow-item.real > div:not(.tools)")](e) {
    var index = +e.$delegateTarget.closest('shadow-item').attr("data-index");

    var shadow = this.state.boxShadows[index]

    this.viewShadowPopup(shadow, index);
  }

  viewShadowPopup(shadow, index) {
    this.selectedIndex = index;

    this.viewBoxShadowPropertyPopup(shadow);
  }

  viewBoxShadowPropertyPopup(shadow) {
    this.emit("showBoxShadowPropertyPopup", {
      changeEvent: 'changeBoxShadowEditorPopup',
      color: shadow.color,
      inset: shadow.inset,
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY,
      blurRadius: shadow.blurRadius,
      spreadRadius: shadow.spreadRadius
    });

    // this.emit('hidePropertyPopup')
  }

  [EVENT("changeBoxShadowEditorColor")](color) {
    this.trigger('changeBoxShadowEditorPopup', { color })
  }

  [EVENT("changeBoxShadowEditorPopup")](data) {

    var shadow = this.state.boxShadows[this.selectedIndex]
    shadow.reset(data)

    this.refresh();

    this.modifyBoxShadow();
  }
}
