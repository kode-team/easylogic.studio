import { POINTERSTART, BIND, isNotUndefined, classnames } from "sapa";

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

export class DefaultLayoutItem extends EditorElement {
  get size() {
    return this.props.size;
  }
}

export class DefaultLayout extends EditorElement {
  getLayoutElements() {
    return this.refs;
  }

  initState() {
    return {
      showLeftPanel: isNotUndefined(this.props.showLeftPanel)
        ? Boolean(this.props.showLeftPanel)
        : true,
      showRightPanel: isNotUndefined(this.props.showRightPanel)
        ? Boolean(this.props.showRightPanel)
        : true,
      topSize: isNotUndefined(this.props.topSize)
        ? Number(this.props.topSize)
        : 48,
      leftSize: isNotUndefined(this.props.leftSize)
        ? Number(this.props.leftSize)
        : 340,
      rightSize: isNotUndefined(this.props.rightSize)
        ? Number(this.props.rightSize)
        : 280,
      bottomSize: this.props.bottomSize || 20,
      lastBottomSize: this.props.lastBottomSize || 150,
      minSize: isNotUndefined(this.props.minSize)
        ? Boolean(this.props.minSize)
        : 240,
      maxSize: isNotUndefined(this.props.maxSize)
        ? Boolean(this.props.maxSize)
        : 500,
    };
  }

  getDirection(direction) {
    return this.getChildContent((it) => it.props.type === direction);
  }

  template() {
    const top = this.getDirection(DefaultLayoutDirection.TOP);
    const left = this.getDirection(DefaultLayoutDirection.LEFT);
    const right = this.getDirection(DefaultLayoutDirection.RIGHT);
    const bottom = this.getDirection(DefaultLayoutDirection.BOTTOM);
    const body = this.getDirection(DefaultLayoutDirection.BODY);
    const inner = this.getDirection(DefaultLayoutDirection.INNER);
    const outer = this.getDirection(DefaultLayoutDirection.OUTER);

    return (
      <div class="elf--default-layout-container">
        <div class={`elf--default-layout`}>
          {top ? (
            <div class="layout-top" ref="$topPanel">
              {top}
            </div>
          ) : (
            ""
          )}

          <div class="layout-middle" ref="$middle">
            {left ? (
              <div class="layout-left" ref="$leftPanel">
                {left}
              </div>
            ) : (
              ""
            )}
            <div class="layout-body" ref="$bodyPanel">
              {body}
            </div>
            {right ? (
              <div class="layout-right" ref="$rightPanel">
                {right}
              </div>
            ) : (
              ""
            )}
            <div class="splitter" ref="$splitter"></div>
          </div>
          {bottom ? (
            <div class="layout-bottom" ref="$bottomPanel">
              {bottom}
            </div>
          ) : (
            ""
          )}
          {inner}
        </div>
        {outer}
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
    let width = this.state.leftSize;

    if (!this.state.showLeftPanel) {
      width = 0;
    }

    return {
      style: { width },
    };
  }

  [BIND("$rightPanel")]() {
    let width = this.state.rightSize;

    if (!this.state.showRightPanel) {
      width = 0;
    }

    return {
      class: classnames("layout-right", { closed: !this.state.showRightPanel }),
      style: { width },
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
}
