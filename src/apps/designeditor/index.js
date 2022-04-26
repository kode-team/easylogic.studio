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

import "./layout.scss";
import designEditorPlugins from "./plugins/design-editor-plugins";

import Inspector from "apps/common/area/Inspector";
import ItemLayerTab from "apps/common/area/ItemLayerTab";
import LayerTab from "apps/common/area/LayerTab";
import SingleInspector from "apps/common/area/SingleInspector";
import SwitchLeftPanel from "apps/common/area/status-bar/SwitchLeftPanel";
import SwitchRightPanel from "apps/common/area/status-bar/SwitchRightPanel";
import ToolBar from "apps/common/area/tool-bar/ToolBar";
import { BaseLayout } from "apps/common/BaseLayout";
import BodyPanel from "apps/common/BodyPanel";
import { IconManager } from "apps/common/IconManager";
import { KeyboardManager } from "apps/common/KeyboardManager";
import { PopupManager } from "apps/common/PopupManager";
import { END, MOVE } from "elf/editor/types/event";
import { Length } from "elf/editor/unit/Length";

export class DesignEditor extends BaseLayout {
  initialize() {
    super.initialize();

    this.$pathkit.load();
  }

  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);

    // load default data
    this.emit("load.json", this.opt.data);
  }

  components() {
    return {
      LayerTab,
      ItemLayerTab,
      ToolBar,
      Inspector,
      SingleInspector,
      BodyPanel,
      PopupManager,
      KeyboardManager,
      IconManager,
      SwitchLeftPanel,
      SwitchRightPanel,
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

  initState() {
    return {
      leftSize: 340,
      rightSize: 280,
      bottomSize: 0,
      lastBottomSize: 150,
    };
  }

  template() {
    const isItemMode = this.$config.is("editor.design.mode", "item");
    return /*html*/ `
      <div class="elf-studio designeditor">
        <div class="layout-main">
          <div class='layout-top' ref='$top'>
            ${createComponent("ToolBar")}
          </div>
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body" ref='$bodyPanel'>
              ${createComponent("BodyPanel", { ref: "$bodyPanelView" })}
            </div>                           
            <div class='layout-left' ref='$leftPanel'>
              ${
                isItemMode
                  ? createComponent("ItemLayerTab")
                  : createComponent("LayerTab")
              }
            </div>
            <div class="layout-right" ref='$rightPanel'>
              ${
                isItemMode
                  ? createComponent("SingleInspector")
                  : createComponent("Inspector")
              }
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
