import {
  DRAGOVER,
  DROP,
  PREVENT,
  POINTERSTART,
  BIND,
  SUBSCRIBE,
  CONFIG,
  isFunction,
  createComponent,
} from "sapa";

import Body3DPanel from "./area/Body3DPanel";
import ThreeInspector from "./area/ThreeInspector";
import ThreeToolBar from "./area/tool-bar/ThreeToolBar";
import "./layout.scss";
import { SceneManager } from "./managers/SceneManager";
import threeEditorPlugins from "./plugins/three-editor-plugins";

import LayerTab from "apps/common/area/LayerTab";
import { BaseLayout } from "apps/common/BaseLayout";
import { IconManager } from "apps/common/IconManager";
import { KeyboardManager } from "apps/common/KeyboardManager";
import { PopupManager } from "apps/common/PopupManager";
import { END, MOVE, RESIZE_CANVAS } from "elf/editor/types/event";
import { Length } from "elf/editor/unit/Length";

export class ThreeEditor extends BaseLayout {
  getManagers() {
    return {
      sceneManager: SceneManager,
    };
  }

  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);

    if (this.opt.data) {
      this.$editor.sceneManager.fromJSON(this.opt.data);
    }
  }

  components() {
    return {
      LayerTab,
      ThreeToolBar,
      ThreeInspector,
      Body3DPanel,
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
    return threeEditorPlugins;
  }

  initState() {
    return {
      leftSize: 340,
      rightSize: 280,
      bottomSize: 0,
      lastBottomSize: 150,
    };
  }

  template() {
    return /*html*/ `
      <div class="elf-studio three-editor">
        <div class="layout-main">
          <div class='layout-top' ref='$top'>
            ${createComponent("ThreeToolBar")}
          </div>
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body" ref='$bodyPanel'>
              ${createComponent("Body3DPanel")}
            </div>                           
            <div class='layout-left' ref='$leftPanel'>
              ${createComponent("LayerTab")}
            </div>
            <div class="layout-right" ref='$rightPanel'>
              ${createComponent("ThreeInspector")}
            </div>
            <div class='splitter' ref='$splitter'></div>            
          </div>
          ${createComponent("KeyboardManager")}
        </div>
        ${createComponent("PopupManager")}
        ${createComponent("IconManager")}
      </div>
    `;
  }

  [BIND("$el")]() {
    return {
      "data-design-mode": this.$config.get("editor.design.mode"),
    };
  }

  [BIND("$splitter")]() {
    let left = this.state.leftSize;
    if (this.$config.false("show.left.panel")) {
      left = 0;
    }

    return {
      style: {
        left: left,
      },
    };
  }

  [BIND("$leftArrow")]() {
    let left = this.state.leftSize;
    if (this.$config.false("show.left.panel")) {
      left = 0;
    }

    return {
      style: {
        left: left,
      },
    };
  }

  [BIND("$leftPanel")]() {
    let left = `0px`;
    let width = this.state.leftSize;
    let bottom = this.state.bottomSize;
    if (this.$config.false("show.left.panel")) {
      left = `-${this.state.leftSize}px`;
    }

    return {
      style: { left, width, bottom },
    };
  }

  [BIND("$rightPanel")]() {
    let right = 0;
    let bottom = this.state.bottomSize;
    if (this.$config.false("show.right.panel")) {
      right = -this.state.rightSize;
    }

    return {
      style: {
        right: right,
        bottom,
      },
    };
  }

  [BIND("$rightArrow")]() {
    let right = 6;
    let bottom = this.state.bottomSize;
    if (this.$config.true("show.right.panel")) {
      right = this.state.rightSize + 6;
    }

    return {
      style: {
        right: right,
        bottom,
      },
    };
  }

  [BIND("$bodyPanel")]() {
    let left = this.state.leftSize;
    let right = this.state.rightSize;
    let bottom = this.state.bottomSize;

    if (this.$config.false("show.left.panel")) {
      left = 0;
    }

    if (this.$config.false("show.right.panel")) {
      right = 0;
    }

    return {
      style: {
        left: left,
        right: right,
        bottom: bottom,
      },
    };
  }

  [POINTERSTART("$splitter") +
    MOVE("moveSplitter") +
    END("moveEndSplitter")]() {
    this.minSize = this.$theme("left_size");
    this.maxSize = this.$theme("left_max_size");
    this.leftSize = Length.parse(this.refs.$splitter.css("left")).value;
    this.refs.$splitter.addClass("selected");
  }

  moveSplitter(dx) {
    this.setState({
      leftSize: Math.max(
        Math.min(this.leftSize + dx, this.maxSize),
        this.minSize
      ),
    });
  }

  moveEndSplitter() {
    this.refs.$splitter.removeClass("selected");
  }

  refresh() {
    this.bindData("$el");
    this.bindData("$splitter");
    this.bindData("$headerPanel");
    this.bindData("$leftPanel");
    this.bindData("$rightPanel");
    this.bindData("$toggleRightButton");
    this.bindData("$toggleLeftButton");
    this.bindData("$bodyPanel");
    this.bindData("$footerPanel");

    this.emit("resizeEditor");
  }

  [CONFIG("show.left.panel")]() {
    this.refresh();
    this.nextTick(() => {
      this.emit(RESIZE_CANVAS);
    });
  }

  [CONFIG("show.right.panel")]() {
    this.refresh();
    this.nextTick(() => {
      this.emit(RESIZE_CANVAS);
    });
  }

  [CONFIG("editor.design.mode")]() {
    this.bindData("$el");
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
