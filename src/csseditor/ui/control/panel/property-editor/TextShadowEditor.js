import { CLICK, LOAD } from "../../../../../util/Event";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import { TextShadow } from "../../../../../editor/css-property/TextShadow";
import { EMPTY_STRING } from "../../../../../util/css/types";
import {
  CHANGE_LAYER,
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";

export default class TextShadowEditor extends UIElement {

  initState() {
    return {
      selectedIndex: -1,
      textShadows: TextShadow.parseStyle(this.props.value)
    }
  }

  template() {
    return `
      <div class="text-shadow-editor" >
        <div class='label' >
            <label>${this.props.title}</label>        
            <div class='tools'>
              <button type="button" ref="$add" title="add Text Shadow">${icon.add}</button>
            </div>
        </div>
        <div class='text-shadow-list' ref='$shadowList'></div>
      </div>
    `;
  }

  [LOAD("$shadowList")]() {
  
    var arr = this.state.textShadows.map((shadow, index) => {
      return `
        <div class="shadow-item real" data-index="${index}">
          <div class="color">
            <div class='color-view' style="background-color: ${shadow.color}" data-index="${index}">
            </div>
          </div>
          <div class="offset-x">${shadow.offsetX.toString()}</div>
          <div class="offset-y">${shadow.offsetY.toString()}</div>
          <div class="blur-radius">${shadow.blurRadius.toString()}</div>
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
            <div class="offset-x">X</div>
            <div class="offset-y">Y</div>
            <div class="blur-radius">Blur</div>
            <div class="tools">
            </div>
          </div>
      `);
    }


    return arr.join(EMPTY_STRING);
  }

  [EVENT(CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  modifyTextShadow () {
    var value = this.state.textShadows.join(', ');

    this.parent.trigger(this.props.onchange, value)
  }


  [CLICK("$add")]() {
    this.state.textShadows.push(new TextShadow())

    this.refresh();

    this.modifyTextShadow()
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    this.state.textShadows.splice(index, 1);

    this.refresh();

    this.modifyTextShadow()
  }

  [CLICK("$shadowList .shadow-item.real .color")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    var shadow = this.state.textShadows[index]

    this.viewShadowPopup(shadow, index);
  }

  viewShadowPopup(shadow, index) {
    this.setState({
      selectedIndex: index
    }, false)

    this.emit("showColorPicker", {
      changeEvent: "changeTextShadowEditorColor",
      color: shadow.color,
      hasNotHide: true
    });

    this.viewTextShadowPropertyPopup(shadow);
  }

  viewTextShadowPropertyPopup(shadow) {
    this.emit("showTextShadowPropertyPopup", {
      changeEvent: 'changeTextShadowEditorPopup',
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY,
      blurRadius: shadow.blurRadius
    });
    // this.emit('hidePropertyPopup')
  }

  [EVENT("changeTextShadowEditorColor")](color) {

    var shadow = this.state.textShadows[this.state.selectedIndex]
    shadow.reset({ color })

    this.refresh();

    this.modifyTextShadow();
  }


  [EVENT("changeTextShadowEditorPopup")](data) {

    var shadow = this.state.textShadows[this.state.selectedIndex]

    shadow.reset(data)

    this.refresh();



    this.modifyTextShadow();
  }
}
