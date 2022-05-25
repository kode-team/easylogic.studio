import { SUBSCRIBE } from "sapa";

import BlankBodyPanel from "./area/BlankBodyPanel";
import BlankInspector from "./area/BlankInspector";
import BlankLayerTab from "./area/BlankLayerTab";
// import BlankStatusbar from "./area/BlankStatusbar";
import BlankToolBar from "./area/tool-bar/BlankToolBar";
import "./layout.scss";
import blankEditorPlugins from "./plugins/blank-editor-plugins";

import { ContextMenuManager } from "apps/common/ContextMenuManager";
import { IconManager } from "apps/common/IconManager";
import { KeyboardManager } from "apps/common/KeyboardManager";
import { BaseLayout } from "apps/common/layout/BaseLayout";
import {
  DefaultLayout,
  DefaultLayoutItem,
} from "apps/common/layout/DefaultLayout";
import { PopupManager } from "apps/common/PopupManager";
import { TOGGLE_FULLSCREEN } from "elf/editor/types/event";

export class BlankEditor extends BaseLayout {
  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);
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
    };
  }

  getTopPanel() {
    return (
      <DefaultLayoutItem type="top">
        <BlankToolBar />
      </DefaultLayoutItem>
    );
  }

  getLeftPanel() {
    return (
      <DefaultLayoutItem type="left" resizable={true}>
        <BlankLayerTab />
      </DefaultLayoutItem>
    );
  }

  getRightPanel() {
    return (
      <DefaultLayoutItem type="right">
        <BlankInspector />
      </DefaultLayoutItem>
    );
  }

  getBodyPanel() {
    return (
      <DefaultLayoutItem type="body">
        <BlankBodyPanel />
      </DefaultLayoutItem>
    );
  }

  getInnerPanel() {
    return (
      <DefaultLayoutItem type="inner">
        <KeyboardManager />
      </DefaultLayoutItem>
    );
  }

  getOuterPanel() {
    return (
      <DefaultLayoutItem type="outer">
        <IconManager />
        <PopupManager />
        <ContextMenuManager />
      </DefaultLayoutItem>
    );
  }

  template() {
    return (
      <div class="elf-editor">
        <DefaultLayout
          showLeftPanel={this.$config.get("show.left.panel")}
          showRightPanel={this.$config.get("show.right.panel")}
          leftSize={340}
          rightSize={280}
          ref="$layout"
        >
          {this.getTopPanel()}
          {this.getLeftPanel()}
          {this.getRightPanel()}
          {this.getBodyPanel()}
          {this.getInnerPanel()}
          {this.getOuterPanel()}
        </DefaultLayout>
      </div>
    );
  }

  refresh() {
    super.refresh();

    this.emit("resizeEditor");
  }

  [SUBSCRIBE(TOGGLE_FULLSCREEN)]() {
    this.$el.toggleFullscreen();
  }
}
