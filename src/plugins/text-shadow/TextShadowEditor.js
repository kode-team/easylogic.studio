import { CLICK, LOAD, SUBSCRIBE } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { TextShadow } from "el/editor/property-parser/TextShadow";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './TextShadowEditor.scss';

export default class TextShadowEditor extends EditorElement {

  initState() {

    return {
      hideLabel: this.props.hideLabel === 'true' ? true : false, 
      selectedIndex: -1,
      textShadows: this.props.value
    }
  }

  template() {

    var labelClass = this.state.hideLabel ? 'hide' : ''; 

    return /*html*/`
      <div class="elf--text-shadow-editor" >
        <div class='text-shadow-list' ref='$shadowList'></div>
      </div>
    `;
  }

  [LOAD("$shadowList")]() {
  
    var arr = this.state.textShadows.map((shadow, index) => {
      return /*html*/`
        <div class="shadow-item real" data-index="${index}">
          <div class="color">
            <div class='color-view' style="background-color: ${shadow.color}">
            </div>
          </div>
          <div class="offset-x">${shadow.offsetX}</div>
          <div class="offset-y">${shadow.offsetY}</div>
          <div class="blur-radius">${shadow.blurRadius}</div>
          <div class="tools">
            <button type="button" class="remove" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
      `;
    });

    if (arr.length) {
      arr.push(/*html*/`
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


    return arr.join('');
  }

  modifyTextShadow () {
    var value = this.state.textShadows.join(', ');

    this.parent.trigger(this.props.onchange, value)
  }


  [SUBSCRIBE('add')] () {
    this.state.textShadows.push(new TextShadow())

    this.refresh();

    this.modifyTextShadow()
  }

  [CLICK("$add")]() {
    this.trigger('add');
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$dt.attr("data-index");

    this.state.textShadows.splice(index, 1);

    this.refresh();

    this.modifyTextShadow()
  }

  [CLICK("$shadowList .shadow-item.real > div:not(.tools)")](e) {
    var index = +e.$dt.closest('shadow-item').attr("data-index");

    var shadow = this.state.textShadows[index]

   this.viewShadowPopup(shadow, index)
  }

  viewShadowPopup(shadow, index) {
    this.setState({
      selectedIndex: index
    }, false)

    this.viewTextShadowPropertyPopup(shadow);
  }

  viewTextShadowPropertyPopup(shadow) {
    this.emit("showTextShadowPropertyPopup", {
      changeEvent: 'changeTextShadowEditorPopup',
      color: shadow.color,
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY,
      blurRadius: shadow.blurRadius
    }, {
      id: this.id
    });
    
  }

  [SUBSCRIBE("changeTextShadowEditorPopup")](data, params) {
    if (params.id === this.id) {
      var shadow = this.state.textShadows[this.state.selectedIndex]

      shadow.reset(data)
  
      this.refresh();
  
      this.modifyTextShadow();
    }

  }
}