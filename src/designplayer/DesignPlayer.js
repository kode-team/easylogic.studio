
import Dom from "@core/Dom";
import UIElement, { EVENT } from "@core/UIElement";

import "@ui/view/PlayCanvasView";

import { registElement } from "@core/registerElement";
import { KEYDOWN, KEYUP } from "@core/Event";

export default class DesignPlayer extends UIElement {
  
  initialize () {
    super.initialize()


    var $body = Dom.body();
    
    $body.attr('data-theme', this.$editor.theme);
    $body.addClass(navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default')
  }
  
  [EVENT('changed.locale')] () {
    this.rerender()
  }

  template() {
    return /*html*/`
      <div class="layout-main player">
        <object refClass='PlayCanvasView' />        
      </div>
    `;
  }

  [EVENT('changeTheme')] () {
    Dom.body().attr('data-theme', this.$editor.theme);
  }

  [EVENT('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [EVENT('refreshAllSelectProject')] () {      
    this.emit('refreshArtboard')
  }

  [KEYDOWN('document')] (e) {
    this.emit('keymap.keydown', e);
  }  


  [KEYUP('document')] (e) {
    this.emit('keymap.keyup', e);
  }  

}

registElement({ DesignPlayer })