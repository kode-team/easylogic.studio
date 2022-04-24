import {
  DRAGOVER,
  DROP,
  PREVENT,
  POINTERSTART,
  BIND,
  SUBSCRIBE,
  CONFIG,
} from "sapa";

import { Length } from "elf/editor/unit/Length";

import BaseLayout from "../common/BaseLayout";
import PopupManager from "../common/PopupManager";
import KeyboardManager from "../common/KeyboardManager";

import { END, MOVE } from "elf/editor/types/event";
import { isFunction } from "sapa";
import IconManager from "../common/IconManager";
import { createComponent } from "sapa";

import "./layout.scss";
import BlankBodyPanel from "../common/BlankBodyPanel";
import BlankToolBar from "editor-layouts/common/area/tool-bar/BlankToolBar";
import blankEditorPlugins from "plugins/blank-editor-plugins";
import BlankInspector from "../common/area/BlankInspector";
import BlankLayerTab from "../common/area/BlankLayerTab";

export default class BlankEditor extends BaseLayout {
  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);

    // 데이타 로드
    // this.loadDataFromJSON();
  }

  components() {
    return {
      BlankLayerTab,
      BlankToolBar,
      BlankInspector,
      BlankBodyPanel,
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
    return blankEditorPlugins;
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
      <div class="elf-studio blank-editor">
        <div class="layout-main">
          <div class='layout-top' ref='$top'>
            ${createComponent("BlankToolBar")}
          </div>
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body" ref='$bodyPanel'>
              ${createComponent("BlankBodyPanel")}
            </div>                           
            <div class='layout-left' ref='$leftPanel'>
              ${createComponent("BlankLayerTab")}
            </div>
            <div class="layout-right" ref='$rightPanel'>
              ${createComponent("BlankInspector")}
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
    this.bindData("$bodyPanel");

    this.emit("resizeEditor");
  }

  [CONFIG("show.left.panel")]() {
    this.refresh();
    this.nextTick(() => {
      this.emit("resizeCanvas");
    });
  }

  [CONFIG("show.right.panel")]() {
    this.refresh();
    this.nextTick(() => {
      this.emit("resizeCanvas");
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
