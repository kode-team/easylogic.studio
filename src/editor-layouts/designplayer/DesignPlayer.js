import "el/editor/items";
import "el/editor/ui/view/PlayCanvasView";

import { SUBSCRIBE } from "el/base/Event";
import BaseLayout from "../BaseLayout";

import "./PlayerPopupManager";
import "./PlayerKeyboardManager";

export default class DesignPlayer extends BaseLayout {

  
  [SUBSCRIBE('changed.locale')] () {
    this.rerender()
  }

  template() {
    return /*html*/`
      <div class="designeditor">    
        <div class="layout-main player">
          <object refClass='PlayCanvasView' />        
          <object refClass="PlayerKeyboardManager" />                          
        </div>
        <object refClass="PlayerPopupManager" />        
      </div>
    `;
  }

  [SUBSCRIBE('toggle.fullscreen')] () {
    this.opt.$container.toggleFullscreen();
  }

}