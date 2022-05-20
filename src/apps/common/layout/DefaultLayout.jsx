import {
  DRAGOVER,
  DROP,
  PREVENT,
  POINTERSTART,
  BIND,
  isNotUndefined,
  classnames,
  createComponent,
} from "sapa";

import { BaseLayout } from "./BaseLayout";
import "./DefaultLayout.scss";

import { END, MOVE } from "elf/editor/types/event";
import { Length } from "elf/editor/unit/Length";

export class DefaultLayout extends BaseLayout {
  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);
  }

  initState() {
    return {
      showLeftPanel: isNotUndefined(this.props.showLeftPanel)
        ? Boolean(this.props.showLeftPanel)
        : true,
      showRightPanel: isNotUndefined(this.props.showRightPanel)
        ? Boolean(this.props.showRightPanel)
        : true,
      leftSize: this.props.leftSize || 340,
      rightSize: this.props.rightSize || 280,
      bottomSize: this.props.bottomSize || 0,
      lastBottomSize: this.props.lastBottomSize || 150,
      minSize: isNotUndefined(this.props.minSize)
        ? Boolean(this.props.minSize)
        : 200,
      maxSize: isNotUndefined(this.props.maxSize)
        ? Boolean(this.props.maxSize)
        : 500,
    };
  }

  template() {
    return (
      <div class={`elf-studio ${classnames(this.state.class)}`}>
        <div class={`default-layout`}>
          <div class="layout-top" ref="$top">
            {this.$injectManager.generate("layout.top", true)}
          </div>
          <div class="layout-middle" ref="$middle">
            <div class="layout-body" ref="$bodyPanel">
              {this.$injectManager.generate("layout.body", true)}
            </div>
            <div class="layout-left" ref="$leftPanel">
              {this.$injectManager.generate("layout.left", true)}
            </div>
            <div class="layout-right" ref="$rightPanel">
              {this.$injectManager.generate("layout.right", true)}
            </div>
            <div class="splitter" ref="$splitter"></div>
          </div>
          {createComponent("KeyboardManager")}
          {this.$injectManager.generate("layout.inner", true)}
        </div>
        {createComponent("PopupManager")}
        {createComponent("IconManager")}
        {this.$injectManager.generate("layout.outer", true)}
      </div>
    );
  }

  [BIND("$splitter")]() {
    let left = this.state.leftSize;
    if (this.state.showLeftPanel) {
      left = 0;
    }

    return {
      style: {
        left: Length.px(left),
      },
    };
  }

  [BIND("$leftPanel")]() {
    let left = `0px`;
    let width = this.state.leftSize;
    let bottom = this.state.bottomSize;
    if (this.state.showLeftPanel) {
      left = `-${this.state.leftSize}px`;
    }

    return {
      style: { left, width, bottom },
    };
  }

  [BIND("$rightPanel")]() {
    let right = 0;
    let bottom = this.state.bottomSize;
    if (this.state.showRightPanel) {
      right = `-${this.state.rightSize}px`;
    }

    return {
      style: {
        right,
        bottom,
      },
    };
  }

  [BIND("$bodyPanel")]() {
    let left = this.state.leftSize;
    let right = this.state.rightSize;
    let bottom = this.state.bottomSize;

    if (this.state.showLeftPanel) {
      left = 0;
    }

    if (this.state.showRightPanel) {
      right = 0;
    }

    return {
      style: {
        left: Length.px(left),
        right: Length.px(right),
        bottom: Length.px(bottom),
      },
    };
  }

  [POINTERSTART("$splitter") +
    MOVE("moveSplitter") +
    END("moveEndSplitter")]() {
    this.leftSize = this.state.leftSize;
    this.refs.$splitter.addClass("selected");
  }

  moveSplitter(dx) {
    this.setState({
      leftSize: Math.max(
        Math.min(this.leftSize + dx, this.state.maxSize),
        this.state.minSize
      ),
    });
  }

  moveEndSplitter() {
    this.refs.$splitter.removeClass("selected");
  }

  refresh() {
    this.bindData("$splitter");
    this.bindData("$headerPanel");
    this.bindData("$leftPanel");
    this.bindData("$rightPanel");
    this.bindData("$bodyPanel");
  }

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER("$middle") + PREVENT]() {}
  [DROP("$middle") + PREVENT]() {}
  /** 드랍존 설정을 위해서 남겨놔야함 */
}
