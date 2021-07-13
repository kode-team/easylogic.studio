import { SUBSCRIBE } from "el/base/Event";
import BaseLayout from "../BaseLayout";

import "./area/PlayerPopupManager";
import "./area/PlayerKeyboardManager";
import designPlayerPlugins from "plugins/design-player-plugins";
import PlayCanvasView from "./area/PlayCanvasView";

export default class DesignPlayer extends BaseLayout {

  components() {
    return {
      PlayCanvasView
    }
  }

  getPlugins() {
    return designPlayerPlugins;
  }
  
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