import UIElement from "@core/UIElement";
import { CLICK } from "@core/Event";
import clipArt from "../clip-art";
import { registElement } from "@core/registerElement";
import { Length } from "@unit/Length";

export default class LibraryItems extends UIElement {

  template() {
    return /*html*/`
      <div class='library-items'>
        <div class='group  path'>
          <div class='title'><label>ClipArt</label></div>
          <div class='list'>
            ${Object.keys(clipArt).map( key => {
              return /*html*/`<div class='library-item' data-key="${key}">${clipArt[key]}</div>`
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  [CLICK('$el .library-item')] (e) {
    var $el = e.$dt;
    var key = e.$dt.data('key');

    const center = this.$viewport.center;

    this.emit('newComponent', 'template', {
      x: Length.px(center[0] - 100),
      y: Length.px(center[1] - 100),
      width: Length.px(200),
      height: Length.px(200),
      template: clipArt[key]
    });

  }
}

registElement({ LibraryItems })
