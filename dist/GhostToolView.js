import { E as EditorElement, c as createElementJsx, S as SUBSCRIBE, a as clone, b as add, L as Layout, t as toRectVerties, d as LOAD, v as vertiesToPath, F as FragmentInstance, e as vertiesToRectangle, f as dist, s as subtract, g as FlexDirection, D as DOMDIFF, h as floor, p as polyPoly, A as AlignItems, J as JustifyContent } from "./index.js";
var GhostToolView$1 = "";
const CHECK_RATE = 0.5;
class GhostToolView extends EditorElement {
  template() {
    return /* @__PURE__ */ createElementJsx("div", {
      class: "elf--ghost-tool-view"
    }, /* @__PURE__ */ createElementJsx("div", {
      ref: "$containerView"
    }), /* @__PURE__ */ createElementJsx("div", {
      ref: "$view"
    }));
  }
  [SUBSCRIBE("startGhostToolView")](verties) {
    const screenVerties = this.$selection.verties;
    this.isLayoutItem = this.$selection.isLayoutItem;
    this.verties = clone(screenVerties);
    this.ghostVerties = clone(screenVerties);
    this.ghostScreenVerties = this.$viewport.applyVerties(this.ghostVerties);
    this.initMousePoint = this.$viewport.getWorldPosition();
    this.filteredLayers = this.$selection.notSelectedLayers;
    this.containerList = this.filteredLayers.filter((it) => it.hasLayout() || it.is("artboard")).map((it) => it.originVerties);
    this.$config.set("set.move.control.point", true);
  }
  collectInformation() {
    var _a;
    const targetMousePoint = this.$viewport.getWorldPosition();
    const newDist = this.getDist();
    this.ghostVerties = this.verties.map((v) => {
      return add([], v, newDist);
    });
    this.ghostScreenVerties = this.$viewport.applyVerties(this.ghostVerties);
    const filteredLayers = this.$selection.filteredLayers.filter((it) => this.$selection.check(it) === false);
    this.targetItem = filteredLayers[0];
    if (this.targetItem) {
      if (this.targetItem.hasLayout() && ((_a = this.targetItem) == null ? void 0 : _a.hasChildren())) {
        if (this.targetItem.isLayout(Layout.FLEX)) {
          this.targetItem = this.targetItem.layers[this.targetItem.layers.length - 1];
        } else if (this.targetItem.isLayout(Layout.GRID))
          ;
      }
      this.$selection.updateDragTargetItem(this.targetItem);
      this.targetOriginPosition = this.$viewport.applyVerties(toRectVerties(this.targetItem.contentVerties));
      this.targetPoint = this.$viewport.applyVertex(targetMousePoint);
      this.targetRelativeMousePoint = {
        x: (this.targetPoint[0] - this.targetOriginPosition[0][0]) / (this.targetOriginPosition[1][0] - this.targetOriginPosition[0][0]),
        y: (this.targetPoint[1] - this.targetOriginPosition[0][1]) / (this.targetOriginPosition[3][1] - this.targetOriginPosition[0][1])
      };
      if (this.targetItem.isLayoutItem()) {
        this.targetParent = this.targetItem.parent;
        if (this.targetParent) {
          this.targetParentPosition = this.$viewport.applyVerties(this.targetParent.contentVerties);
        }
      } else {
        this.targetParent = null;
        this.targetParentPosition = null;
      }
    } else {
      this.targetPoint = null;
      this.targetRelativeMousePoint = null;
      this.targetParent = null;
      this.targetParentPosition = null;
    }
  }
  [SUBSCRIBE("moveFirstGhostToolView")]() {
    this.collectInformation();
    this.load("$containerView");
    this.load("$view");
  }
  [SUBSCRIBE("moveGhostToolView")]() {
    this.collectInformation();
    this.load("$view");
  }
  [LOAD("$containerView")]() {
    var _a;
    if (!this.ghostVerties) {
      return /* @__PURE__ */ createElementJsx("svg", null);
    }
    return /* @__PURE__ */ createElementJsx("svg", null, (_a = this.containerList) == null ? void 0 : _a.map((it) => {
      it = this.$viewport.applyVerties(it);
      return /* @__PURE__ */ createElementJsx("path", {
        class: "container",
        d: `
                    M ${it[0][0]} ${it[0][1]}
                    L ${it[1][0]} ${it[1][1]}
                    L ${it[2][0]} ${it[2][1]}
                    L ${it[3][0]} ${it[3][1]}
                    Z
                `
      });
    }));
  }
  renderPathForVerties(verties, className) {
    if (!verties) {
      return /* @__PURE__ */ createElementJsx("g", null);
    }
    const d = vertiesToPath(verties);
    return /* @__PURE__ */ createElementJsx("g", null, /* @__PURE__ */ createElementJsx("path", {
      class: className,
      d
    }));
  }
  renderPath(verties, className, data = className) {
    if (!verties)
      return "";
    verties = data === "ghost" ? verties : toRectVerties(verties);
    const textX = className === "flex-item" ? verties[0][0] : verties[0][0];
    const textY = className === "flex-item" ? verties[2][1] + 10 : verties[0][1] - 10;
    return /* @__PURE__ */ createElementJsx("g", null, /* @__PURE__ */ createElementJsx("text", {
      x: textX,
      y: textY,
      "font-size": 8
    }, data), this.renderPathForVerties(verties, className));
  }
  renderLayoutFlexRowArea() {
    if (this.targetRelativeMousePoint.x < CHECK_RATE) {
      return /* @__PURE__ */ createElementJsx(FragmentInstance, null, this.renderPathForVerties([this.targetOriginPosition[0], this.targetOriginPosition[3]], "flex-target"));
    } else {
      return /* @__PURE__ */ createElementJsx(FragmentInstance, null, this.renderPathForVerties([this.targetOriginPosition[1], this.targetOriginPosition[2]], "flex-target"));
    }
  }
  renderLayoutFlexForFirstItem(direction) {
    const isColumn = direction === FlexDirection.COLUMN;
    const verticalField = isColumn ? "align-items" : "justify-content";
    const verticalConst = isColumn ? AlignItems : JustifyContent;
    const horizontalField = isColumn ? "justify-content" : "align-items";
    const horizontalConst = isColumn ? JustifyContent : AlignItems;
    const rect = vertiesToRectangle(this.targetOriginPosition);
    const center = this.ghostScreenVerties[4];
    const width = dist(this.ghostScreenVerties[0], this.ghostScreenVerties[1]);
    const height = dist(this.ghostScreenVerties[0], this.ghostScreenVerties[3]);
    let newCenterX = width / 2;
    let newCenterY = height / 2;
    switch (this.targetItem[verticalField]) {
      case verticalConst.FLEX_START:
        newCenterX = rect.x + width / 2;
        break;
      case verticalConst.CENTER:
      case verticalConst.SPACE_BETWEEN:
      case verticalConst.SPACE_AROUND:
        newCenterX = rect.x + rect.width / 2;
        break;
      case verticalConst.FLEX_END:
        newCenterX = rect.x + rect.width - width / 2;
        break;
    }
    switch (this.targetItem[horizontalField]) {
      case horizontalConst.FLEX_START:
        newCenterY = rect.y + height / 2;
        break;
      case horizontalConst.CENTER:
      case horizontalConst.SPACE_BETWEEN:
      case horizontalConst.SPACE_AROUND:
        newCenterY = rect.y + rect.height / 2;
        break;
      case horizontalConst.FLEX_END:
        newCenterY = rect.y + rect.height - height / 2;
        break;
    }
    const newDist = subtract([], [newCenterX, newCenterY, 0], center);
    const renderVerties = this.ghostScreenVerties.map((it) => add([], it, newDist)).filter((it, index) => index < 4);
    return this.renderPathForVerties(renderVerties, "flex-item", "ghost");
  }
  renderLayoutFlexColumnArea() {
    if (this.targetRelativeMousePoint.y < 0) {
      return "";
    }
    if (this.targetRelativeMousePoint.y < CHECK_RATE) {
      return this.renderPathForVerties([this.targetOriginPosition[0], this.targetOriginPosition[1]], "flex-target");
    } else {
      return this.renderPathForVerties([this.targetOriginPosition[2], this.targetOriginPosition[3]], "flex-target");
    }
  }
  renderLayoutItemInsertArea() {
    if (!this.targetParent) {
      return;
    }
    if (this.targetParent.hasLayout()) {
      if (this.targetParent.isLayout(Layout.FLEX)) {
        switch (this.targetParent["flex-direction"]) {
          case FlexDirection.ROW:
            return this.renderLayoutFlexRowArea();
          case FlexDirection.COLUMN:
            return this.renderLayoutFlexColumnArea();
        }
      } else if (this.targetParent.isLayout(Layout.GRID))
        ;
    }
    return /* @__PURE__ */ createElementJsx("path", {
      class: "insert-area",
      d: `

        `
    });
  }
  renderLayoutItemForFirst() {
    var _a;
    if (((_a = this.targetItem) == null ? void 0 : _a.hasChildren()) === false) {
      if (this.targetItem.isLayout(Layout.FLEX)) {
        return this.renderLayoutFlexForFirstItem(this.targetItem["flex-direction"]);
      } else if (this.targetItem.isLayout(Layout.GRID))
        ;
    }
    return /* @__PURE__ */ createElementJsx("path", {
      class: "insert-area",
      d: `

        `
    });
  }
  [LOAD("$view") + DOMDIFF]() {
    var _a;
    const current = this.$selection.current;
    if (!this.ghostVerties || !current) {
      return /* @__PURE__ */ createElementJsx("svg", null);
    }
    const hasTargetView = ((_a = this.targetItem) == null ? void 0 : _a.id) !== current.id;
    return /* @__PURE__ */ createElementJsx("svg", null, this.targetParent && this.renderPathForVerties(this.targetParentPosition, "target-parent"), hasTargetView && this.renderPathForVerties(this.targetOriginPosition, "target", ""), hasTargetView && this.renderPathForVerties(this.targetOriginPosition, "target-rect", ""), hasTargetView && this.renderLayoutItemInsertArea(), hasTargetView && this.renderLayoutItemForFirst(), this.isLayoutItem && this.renderPathForVerties(this.ghostScreenVerties.filter((_, index) => index < 4), "ghost"));
  }
  initializeGhostView() {
    this.isLayoutItem = false;
    this.ghostVerties = void 0;
    this.ghostScreenVerties = void 0;
    this.targetOriginPosition = void 0;
    this.targetOriginPosition = void 0;
    this.targetRelativeMousePoint = void 0;
    this.targetItem = void 0;
    this.targetParent = void 0;
    this.targetParentPosition = void 0;
    this.$selection.updateDragTargetItem(this.targetItem);
  }
  getDist() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const newDist = floor([], subtract([], targetMousePoint, this.initMousePoint));
    return newDist;
  }
  insertToBackground() {
    const current = this.$selection.current;
    const newDist = this.getDist();
    if (current.isLayoutItem() === false)
      return;
    this.command("moveLayerToTarget", "change target with move", current, this.$selection.currentProject, newDist, "appendChild");
  }
  getTargetAction() {
    let targetAction = "";
    if (this.targetParent.hasLayout()) {
      if (this.targetParent.isLayout(Layout.FLEX)) {
        switch (this.targetParent["flex-direction"]) {
          case FlexDirection.ROW:
            if (this.targetRelativeMousePoint.x < CHECK_RATE) {
              targetAction = "appendBefore";
            } else {
              targetAction = "appendAfter";
            }
            break;
          case FlexDirection.COLUMN:
            if (this.targetRelativeMousePoint.y < CHECK_RATE) {
              targetAction = "appendBefore";
            } else {
              targetAction = "appendAfter";
            }
            break;
        }
      }
    }
    return targetAction;
  }
  insertToLayoutItem() {
    const current = this.$selection.current;
    const newDist = this.getDist();
    if (this.targetParent.hasLayout()) {
      let targetAction = this.getTargetAction();
      if (this.targetParent.isLayout(Layout.FLEX)) {
        if (targetAction) {
          this.command("moveLayerToTarget", "change target with move", current, this.targetItem, newDist, targetAction);
        }
      } else if (this.targetParent.isLayout(Layout.GRID))
        ;
    }
  }
  insertToGridItem() {
    const current = this.$selection.current;
    const { info, items } = this.$selection.gridInformation || { items: [] };
    const currentVerties = this.ghostVerties.filter((_, index) => index < 4);
    const checkedItems = items == null ? void 0 : items.filter((it) => {
      return polyPoly(it.originVerties, currentVerties);
    });
    if (checkedItems.length) {
      const columnList = checkedItems.map((it) => it.column);
      const rowList = checkedItems.map((it) => it.row);
      const columnStart = Math.min(...columnList);
      const rowStart = Math.min(...rowList);
      const columnEnd = Math.max(...columnList) + 1;
      const rowEnd = Math.max(...rowList) + 1;
      this.command("setAttributeForMulti", "change grid item", this.$selection.packByValue({
        "grid-column-start": columnStart,
        "grid-column-end": columnEnd,
        "grid-row-start": rowStart,
        "grid-row-end": rowEnd
      }));
      if (this.targetItem.hasChild(current.id) === false) {
        this.command("moveLayerToTarget", "change target with move", current, this.targetItem, 0, "appendChild");
      }
      return;
    } else {
      if (this.targetItem) {
        this.emit("refreshGridToolInfo", this.targetItem);
        this.command("moveLayerToTarget", "change target with move", current, this.targetItem, 0, "appendChild");
      }
    }
  }
  updateLayer() {
    var _a;
    const current = this.$selection.current;
    if (!current)
      return;
    const newDist = this.getDist();
    if (newDist[0] === 0 && newDist[1] === 0) {
      return;
    }
    if (this.targetItem && this.targetItem.id === (current == null ? void 0 : current.id)) {
      return;
    }
    if (!this.targetItem) {
      this.insertToBackground();
      return;
    }
    if (this.targetItem.hasLayout()) {
      if (((_a = this.targetItem) == null ? void 0 : _a.hasChildren()) === false && this.targetItem.isLayout(Layout.FLEX)) {
        this.command("moveLayerToTarget", "change target with move", current, this.targetItem, newDist, "appendChild");
        return;
      } else {
        if (this.targetItem.isLayout(Layout.GRID)) {
          this.insertToGridItem();
          return;
        }
      }
    }
    if (this.targetParent) {
      this.insertToLayoutItem();
      return;
    }
    if (current.isLayoutItem() && current.parent.id !== this.targetItem.id) {
      this.command("moveLayerToTarget", "change target with move", current, this.targetItem, newDist, "appendChild");
    }
  }
  [SUBSCRIBE("endGhostToolView")](hasMoved = false) {
    if (hasMoved) {
      this.updateLayer();
    }
    this.initializeGhostView();
    this.load();
  }
}
export { GhostToolView as default };
