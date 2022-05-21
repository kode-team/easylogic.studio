import { POINTERSTART, BIND, SUBSCRIBE, CONFIG } from "sapa";

import BlankBodyPanel from "./area/BlankBodyPanel";
import BlankInspector from "./area/BlankInspector";
import BlankLayerTab from "./area/BlankLayerTab";
import BlankToolBar from "./area/tool-bar/BlankToolBar";
import "./layout.scss";
import blankEditorPlugins from "./plugins/blank-editor-plugins";

import { IconManager } from "apps/common/IconManager";
import { KeyboardManager } from "apps/common/KeyboardManager";
import { BaseLayout } from "apps/common/layout/BaseLayout";
import {
  DefaultLayout,
  DefaultLayoutItem,
} from "apps/common/layout/DefaultLayout";
import { PopupManager } from "apps/common/PopupManager";
import {
  END,
  MOVE,
  TOGGLE_FULLSCREEN,
  RESIZE_CANVAS,
} from "elf/editor/types/event";
import { Length } from "elf/editor/unit/Length";

export class BlankEditor extends BaseLayout {
  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);

    // 데이타 로드
    // this.loadDataFromJSON();
  }

  // components() {
  //   return {
  //     BlankLayerTab,
  //     BlankToolBar,
  //     BlankInspector,
  //     BlankBodyPanel,
  //     PopupManager,
  //     KeyboardManager,
  //     IconManager,
  //   };
  // }

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
    };
  }

  template() {
    return (
      <div class="elf-studio blank-editor">
        <DefaultLayout
          showLeftPanel={this.$config.get("show.left.panel")}
          showRightPanel={this.$config.get("show.right.panel")}
          leftSize={340}
          rightSize={280}
          ref="$layout"
        >
          <DefaultLayoutItem type="top">
            <BlankToolBar />
          </DefaultLayoutItem>
          <DefaultLayoutItem type="left" resizable="true">
            <BlankLayerTab />
          </DefaultLayoutItem>
          <DefaultLayoutItem type="right">
            <BlankInspector />
          </DefaultLayoutItem>
          <DefaultLayoutItem type="body">
            <BlankBodyPanel />
          </DefaultLayoutItem>
          <DefaultLayoutItem type="inner">
            <KeyboardManager />
          </DefaultLayoutItem>
          <DefaultLayoutItem type="outer">
            <IconManager />
            <PopupManager />
          </DefaultLayoutItem>
        </DefaultLayout>
      </div>
    );
    // return (
    //   <div class="elf-studio blank-editor">
    //     <div class="layout-main">
    //       <div class="layout-top" ref="$top">
    //         {createComponent("BlankToolBar")}
    //       </div>
    //       <div class="layout-middle" ref="$middle">
    //         <div class="layout-left" ref="$leftPanel">
    //           {createComponent("BlankLayerTab")}
    //         </div>
    //         <div class="layout-body" ref="$bodyPanel">
    //           {createComponent("BlankBodyPanel")}
    //         </div>
    //         <div class="layout-right" ref="$rightPanel">
    //           {createComponent("BlankInspector")}
    //         </div>
    //         <div class="splitter" ref="$splitter"></div>
    //       </div>
    //       {createComponent("KeyboardManager")}
    //     </div>
    //     {createComponent("PopupManager")}
    //     {createComponent("IconManager")}
    //   </div>
    // );
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

  [BIND("$leftPanel")]() {
    let width = this.state.leftSize;

    return {
      style: {
        width,
        display: this.$config.true("show.left.panel") ? "block" : "none",
      },
    };
  }

  [BIND("$rightPanel")]() {
    return {
      style: {
        display: this.$config.true("show.right.panel") ? "block" : "none",
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
    this.bindData("$splitter");
    this.bindData("$leftPanel");
    this.bindData("$rightPanel");

    this.emit("resizeEditor");
  }

  [CONFIG("show.left.panel")]() {
    this.children.$layout.setOptions({
      showLeftPanel: this.$config.get("show.left.panel"),
    });

    this.nextTick(() => {
      this.emit(RESIZE_CANVAS);
    });
  }

  [CONFIG("show.right.panel")]() {
    this.children.$layout.setOptions({
      showLeftPanel: this.$config.get("show.right.panel"),
    });

    this.nextTick(() => {
      this.emit(RESIZE_CANVAS);
    });
  }

  [SUBSCRIBE(TOGGLE_FULLSCREEN)]() {
    this.$el.toggleFullscreen();
  }
}
