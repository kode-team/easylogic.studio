
import Dom from "el/base/Dom";


import "el/editor/items";
import "el/editor/ui/view/PlayCanvasView";

import { registElement } from "el/base/registerElement";
import { KEYDOWN, KEYUP, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import 'el/plugins';
export default class DesignPlayer extends EditorElement {
  
  initialize () {
    super.initialize()

    this.$editor.initPlugins();

    var $body = Dom.body();
    
    $body.attr('data-theme', this.$editor.theme);
    $body.addClass(navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default')
  }
  
  [SUBSCRIBE('changed.locale')] () {
    this.rerender()
  }

  template() {
    return /*html*/`
      <div class="layout-main player">
        <object refClass='PlayCanvasView' />        
      </div>
    `;
  }

  [SUBSCRIBE('changeTheme')] () {
    Dom.body().attr('data-theme', this.$editor.theme);
  }

  [SUBSCRIBE('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [SUBSCRIBE('refreshAllSelectProject')] () {      
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