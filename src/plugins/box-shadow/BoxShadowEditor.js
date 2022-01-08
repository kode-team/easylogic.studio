import { CLICK, LOAD, SUBSCRIBE } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { BoxShadow } from "el/editor/property-parser/BoxShadow";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { Length } from "el/editor/unit/Length";

import './BoxShadowEditor.scss';

export default class BoxShadowEditor extends EditorElement {

  initState() {
    return {
      hideLabel: this.props.hideLabel === 'true' ? true : false,
      boxShadows: BoxShadow.parseStyle(this.props.value || '')
    }
  }

  template() {
    return /*html*/`
      <div class="elf--box-shadow-editor" >
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
        <div class="blur-radius">${this.$i18n('boxshadow.editor.blur')}</div>
        <div class="spread-radius">${this.$i18n('boxshadow.editor.spread')}</div>
        <div class="tools">
        </div>
      </div>
      `);
    }


    return arr.join('');
  }

  modifyBoxShadow () {
    var value = this.state.boxShadows.join(', ');

    this.parent.trigger(this.props.onchange, value)
  }

  [SUBSCRIBE('add')] () {
    this.state.boxShadows.push(new BoxShadow({
      offsetX: 2,
      offsetY: 2,
      blurRadius: 3,
      spreadRadius: 1
    }))

    this.refresh();

    this.modifyBoxShadow()
  }

  [CLICK("$add")]() {
    this.trigger('add');
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$dt.attr("data-index");

    this.state.boxShadows.splice(index, 1);

    this.refresh();

    this.modifyBoxShadow()

    this.emit('hideBoxShadowPropertyPopup')
  }


  [CLICK("$shadowList .shadow-item.real > div:not(.tools)")](e) {
    var index = +e.$dt.closest('shadow-item').attr("data-index");

    var shadow = this.state.boxShadows[index]

    this.viewShadowPopup(shadow, index);
  }

  viewShadowPopup(shadow, index) {
    this.selectedIndex = index;

    this.viewBoxShadowPropertyPopup(shadow);
  }

  viewBoxShadowPropertyPopup(shadow) {
    this.emit("showBoxShadowPropertyPopup", {
      changeEvent: (data, params) => {
        var shadow = this.state.boxShadows[this.selectedIndex]
        if (shadow) {
          shadow.reset(data)
          this.refresh();
    
          this.modifyBoxShadow();      
        }
      },
      color: shadow.color,
      inset: shadow.inset,
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY,
      blurRadius: shadow.blurRadius,
      spreadRadius: shadow.spreadRadius
    }, { id: this.id });

  }
}