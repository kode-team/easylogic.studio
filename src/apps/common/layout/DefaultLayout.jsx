import { POINTERSTART, BIND, isNotUndefined } from "sapa";

import "./DefaultLayout.scss";

import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

const DefaultLayoutDirection = {
  LEFT: "left",
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom",
  BODY: "body",
  INNER: "inner",
  OUTER: "outer",
};

export class DefaultLayoutItem extends EditorElement {}

export class DefaultLayout extends EditorElement {
  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);
  }

  initState() {
    console.log(this);
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

  getDirection(direction) {
    return this.getChildContent((it) => it.props.type === direction);
  }

  template() {
    return (
      <div class="elf--default-layout-container">
        <div class={`elf--default-layout`}>
          <div class="layout-top" ref="$top">
            {this.getDirection(DefaultLayoutDirection.TOP)}
          </div>
          <div class="layout-middle" ref="$middle">
            <div class="layout-body" ref="$bodyPanel">
              {this.getDirection(DefaultLayoutDirection.BODY)}
            </div>
            <div class="layout-left" ref="$leftPanel">
              {this.getDirection(DefaultLayoutDirection.LEFT)}
            </div>
            <div class="layout-right" ref="$rightPanel">
              {this.getDirection(DefaultLayoutDirection.RIGHT)}
            </div>
            <div class="splitter" ref="$splitter"></div>
          </div>
          {this.getDirection(DefaultLayoutDirection.INNER)}
        </div>
        {this.getDirection(DefaultLayoutDirection.OUTER)}
      </div>
    );
  }

  [BIND("$splitter")]() {
    let left = this.state.leftSize;
    if (!this.state.showLeftPanel) {
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
    if (!this.state.showLeftPanel) {
      left = `-${this.state.leftSize}px`;
    }

    return {
      style: { left, width, bottom },
    };
  }

  [BIND("$rightPanel")]() {
    let right = 0;
    let bottom = this.state.bottomSize;
    if (!this.state.showRightPanel) {
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

    if (!this.state.showLeftPanel) {
      left = 0;
    }

    if (!this.state.showRightPanel) {
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

  setOptions(obj = {}) {
    this.setState(obj);
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
}
