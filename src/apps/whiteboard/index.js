import {
  DRAGOVER,
  DROP,
  PREVENT,
  SUBSCRIBE,
  isFunction,
  createComponent,
} from "sapa";

import { ClipboardManager } from "../designeditor/managers/ClipboardManager";
import { HistoryManager } from "../designeditor/managers/HistoryManager";
import { LockManager } from "../designeditor/managers/LockManager";
import { ModelManager } from "../designeditor/managers/ModelManager";
import { PathKitManager } from "../designeditor/managers/PathKitManager";
import { SegmentSelectionManager } from "../designeditor/managers/SegmentSelectionManager";
import { SelectionManager } from "../designeditor/managers/SelectionManager";
import { SnapManager } from "../designeditor/managers/SnapManager";
import { VisibleManager } from "../designeditor/managers/VisibleManager";
import "./layout.scss";
import whiteboardPlugins from "./plugins/whiteboard-plugins";

import { IconManager } from "apps/common/IconManager";
import { KeyboardManager } from "apps/common/KeyboardManager";
import { BaseLayout } from "apps/common/layout/BaseLayout";
import { PopupManager } from "apps/common/PopupManager";
import PreviewBodyPanel from "apps/common/PreviewBodyPanel";

/**
 * whiteboard system
 *
 * todo
 *
 * 1. menu system
 * 2. attribute property
 *
 */
export class WhiteBoard extends BaseLayout {
  initialize() {
    super.initialize();

    this.$context.pathkit.load();
  }

  getManagers() {
    return {
      snapManager: SnapManager,
      selection: SelectionManager,
      segmentSelection: SegmentSelectionManager,
      history: HistoryManager,
      modelManager: ModelManager,
      lockManager: LockManager,
      visibleManager: VisibleManager,
      clipboard: ClipboardManager,
      pathkit: PathKitManager,
    };
  }

  components() {
    return {
      PreviewBodyPanel,
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
    return whiteboardPlugins;
  }

  template() {
    return /*html*/ `
      <div class="elf-studio whiteboard">
        <div class="layout-main">
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body">
              ${createComponent("PreviewBodyPanel")}
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

    // load default data
    this.$commands.emit("load.json", this.opt.data);
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
