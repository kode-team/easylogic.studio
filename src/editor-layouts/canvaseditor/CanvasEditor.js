import { DRAGOVER, DROP, PREVENT, SUBSCRIBE } from "el/base/Event";
import canvasEditorPlugins from "plugins/canvas-editor-plugins";

import BaseLayout from "../common/BaseLayout"; 
import BodyPanel from "../common/BodyPanel";
import KeyboardManager from "../common/KeyboardManager";
import PopupManager from "../common/PopupManager";


export default class DesignEditor extends BaseLayout {

  components() {
    return {
      BodyPanel,
      PopupManager,
      KeyboardManager
    }
  }

  getPlugins() {
    return canvasEditorPlugins
  }

  initState() {
    return {
      leftSize: 340,
      rightSize: 260,
      bottomSize: 0,
      lastBottomSize: 150
    }
  }

  template() {
    return /*html*/`
      <div class="designeditor">
        <div class="layout-main">
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body" ref='$bodyPanel'>
              <object refClass="BodyPanel" ref="$bodyPanelView" />
            </div>                           
          </div>
          <object refClass="KeyboardManager" />                
        </div>
        <object refClass="PopupManager" />                      
      </div>
    `;
  }

  refresh () {    
    this.emit('resizeEditor');
  }

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER('$middle') + PREVENT] (e) {}
  [DROP('$middle') + PREVENT] (e) {}
  /** 드랍존 설정을 위해서 남겨놔야함 */  

  [SUBSCRIBE('toggle.fullscreen')] () {
    this.$el.toggleFullscreen();
  }
}