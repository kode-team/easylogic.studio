import {
  DRAGOVER,
  DROP,
  PREVENT,
  SUBSCRIBE,
  isFunction,
  createComponent,
} from "sapa";

import "./layout.scss";

import { BaseLayout } from "apps/common/BaseLayout";
import BodyPanel from "apps/common/BodyPanel";
import { IconManager } from "apps/common/IconManager";
import { KeyboardManager } from "apps/common/KeyboardManager";
import { PopupManager } from "apps/common/PopupManager";
import designEditorPlugins from "apps/designeditor/plugins/design-editor-plugins";

/**
 * whiteboard system
 *
 * todo
 *
 * 1. menu system
 * 2. attribute property
 *
 */
export default class WhiteBoard extends BaseLayout {
  initialize() {
    super.initialize();

    this.$pathkit.load();

    // load default data
    this.emit("load.json", this.opt.data);
  }

  components() {
    return {
      BodyPanel,
      PopupManager,
      KeyboardManager,
      IconManager,
    };
  }

  /**
   *
   * @protected
   * @returns {function[]}
   */
  getPlugins() {
    return designEditorPlugins;
  }

  template() {
    return /*html*/ `
      <div class="elf-studio whiteboard">
        <div class="layout-main">
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body" ref='$bodyPanel'>
              ${createComponent("BodyPanel", { ref: "$bodyPanelView" })}
            </div>                           
          </div>
          ${createComponent("KeyboardManager")}
        </div>
        ${createComponent("PopupManager")}
        ${createComponent("IconManager")}
      </div>
    `;
  }

  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);
  }

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER("$middle") + PREVENT]() {}
  [DROP("$middle") + PREVENT]() {}
  /** 드랍존 설정을 위해서 남겨놔야함 */

  [SUBSCRIBE("toggle.fullscreen")]() {
    this.$el.toggleFullscreen();
  }

  [SUBSCRIBE("getLayoutElement")](callback) {
    if (isFunction(callback)) {
      callback(this.refs);
    }
  }
}
