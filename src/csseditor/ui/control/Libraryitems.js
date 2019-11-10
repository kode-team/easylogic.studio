import UIElement from "../../../util/UIElement";
import PathStringManager from "../../../editor/parse/PathStringManager";
import { CLICK } from "../../../util/Event";
import clipArt from "../clip-art";

export default class LibraryItems extends UIElement {
  components() {
    return {

    }
  }
  template() {
    return /*html*/`
      <div class='library-items'>
        <div class='group  path'>
          <div class='title'><label>ClipArt</label></div>
          <div class='list'>
            ${Object.keys(clipArt).map( key => {
              return /*html*/`<div class='path-item'>${clipArt[key]}</div>`
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

[CLICK('$el .path-item')] (e) {
  var $el = e.$delegateTarget;
  var $svg = $el.$('svg');
  var $path = $svg.$('path');

  var [x, y, width, height] = $svg.attr('viewBox').split(' '); 

  var pathString = $path.attr('d');
  var rect = {x: +x, y: +y, width: +width, height: +height} 

  this.emit('convert.path', pathString, rect);
}

}
