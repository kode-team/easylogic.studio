import { SUBSCRIBE } from "el/base/Event";
import BaseLayout from "../common/BaseLayout";

import designPlayerPlugins from "plugins/design-player-plugins";

import PlayerCanvasView from "./area/PlayerCanvasView";
import PlayerPopupManager from "./area/PlayerPopupManager";
import PlayerKeyboardManager from "./area/PlayerKeyboardManager";



export default class DesignPlayer extends BaseLayout {

  components() {
    return {
      PlayerPopupManager,
      PlayerKeyboardManager,
      PlayerCanvasView
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
          <object refClass='PlayerCanvasView' />        
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