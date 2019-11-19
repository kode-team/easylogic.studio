import { CLICK, LOAD } from "../../../util/Event";
import UIElement, { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { BoxShadow } from "../../../editor/css-property/BoxShadow";
import { editor } from "../../../editor/editor";

const i18n = editor.initI18n('boxshadow.editor')

export default class BoxShadowEditor extends UIElement {

  initState() {
    return {
      hideLabel: this.props['hide-label'] === 'true' ? true : false,
      boxShadows: BoxShadow.parseStyle(this.props.value || '')
    }
  }

  template() {
    var labelClass = this.state.hideLabel ? 'hide' : '';
    return /*html*/`
      <div class="box-shadow-editor" >
        <div class='label ${labelClass}' >
            <label>${this.props.title||''}</label>
            <div class='tools'>
              <button type="button" ref="$add" title="add Box Shadow">${icon.add}</button> ${this.props.title ? '': 'Add'}
            </div>
        </div>
        <div class='box-shadow-list' ref='$shadowList'></div>
      </div>
    `;
  }

  [LOAD("$shadowList")]() {
    var arr = this.state.boxShadows.map((shadow, index) => {
      return /*html*/`
        <div class="shadow-item real" data-index="${index}">
          <div class="color">
            <div class='color-view' style="background-color: ${shadow.color}">
            </div>
          </div>
          <div class="inset" data-value="${shadow.inset}">${icon.check}</div>
          <div class="offset-x">${shadow.offsetX}</div>
          <div class="offset-y">${shadow.offsetY}</div>
          <div class="blur-radius">${shadow.blurRadius}</div>
          <div class="spread-radius">${shadow.spreadRadius}</div>
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
        <div class="inset" >Inset</div>

        <div class="offset-x">X</div>
        <div class="offset-y">Y</div>
        <div class="blur-radius">${i18n('blur')}</div>
        <div class="spread-radius">${i18n('spread')}</div>
        <div class="tools">
        </div>
      </div>
      `);
    }


    return arr.join('');
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }

  modifyBoxShadow () {
    var value = this.state.boxShadows.join(', ');

    this.parent.trigger(this.props.onchange, value)
  }

  [EVENT('add')] () {
    this.state.boxShadows.push(new BoxShadow())

    this.refresh();

    this.modifyBoxShadow()
  }

  [CLICK("$add")]() {
    this.trigger('add');
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
    }, { id: this.id });

  }

  [EVENT("changeBoxShadowEditorColor")](color) {
    this.trigger('changeBoxShadowEditorPopup', { color })
  }

  [EVENT("changeBoxShadowEditorPopup")](data, params) {

    if (params.id === this.id) {
      var shadow = this.state.boxShadows[this.selectedIndex]
      if (shadow) {
        shadow.reset(data)
        this.refresh();
  
        this.modifyBoxShadow();      
      }
    }
  }
}
