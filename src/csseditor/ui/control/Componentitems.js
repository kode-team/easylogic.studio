import UIElement from "../../../util/UIElement";
import { CLICK, LOAD } from "../../../util/Event";
import { editor } from "../../../editor/editor";
var omit = ['project', 'artboard', 'component']
export default class ComponentItems extends UIElement {
  template() {
    return /*html*/`
      <div class='component-items'>
        <div class='group'>
          <div class='list' ref='$list'></div>
        </div>
      </div>
    `;
  }

  afterRender() {
    setTimeout(() => {
      this.load('$list')
    }, 1000)
  }

  [LOAD('$list')] () {

    return Object.keys(editor.components).filter(key => omit.includes(key) === false).map(key => {
      var icon = editor.getComponentClass(key).getIcon();
      return /*html*/`
      <div class='item' data-type='${key}'>
        <div class='icon'>${icon}</div>
        <div class='title'>${key}</div>
      </div>`
    })
  }

  [CLICK('$list .item')] (e) {
    var type = e.$delegateTarget.attr('data-type')

    this.emit('add.component', type);
  }

}
