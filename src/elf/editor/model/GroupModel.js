import DefaultLayoutEngine from "../layout-engine/DefaultLayoutEngine";
import GridLayoutEngine from "../layout-engine/GridLayoutEngine";
import { MovableModel } from "./MovableModel";

import {
  AlignContent,
  AlignItems,
  Constraints,
  FlexDirection,
  FlexWrap,
  JustifyContent,
  Layout,
  ResizingMode,
} from "elf/editor/types/model";

const LayoutEngine = {
  [Layout.DEFAULT]: DefaultLayoutEngine,
  [Layout.GRID]: GridLayoutEngine,
};

export class GroupModel extends MovableModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      layout: Layout.DEFAULT,
      constraintsHorizontal: Constraints.NONE,
      constraintsVertical: Constraints.NONE,
      // flex
      flexDirection: FlexDirection.ROW,
      flexWrap: FlexWrap.NOWRAP,
      justifyContent: JustifyContent.FLEX_START,
      alignItems: AlignItems.FLEX_START,
      alignContent: AlignContent.FLEX_START,
      order: 0,
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: "auto", // 항목의 크기를 기본 크기(원래 가지고 있는 크기)로 정함
      gap: 0,
      resizingHorizontal: ResizingMode.FIXED,
      resizingVertical: ResizingMode.FIXED,
      // grid
      gridTemplateRows: "auto",
      gridColumnGap: "0px",
      gridTemplateColumns: "auto",
      gridRowGap: "0px",
      gridTemplateAreas: "",
      gridAutoRows: "auto",
      gridAutoColumns: "auto",
      gridAutoFlow: "row",
      ...obj,
    });
  }

  reset(obj, context = { origin: "*" }) {
    const isChanged = super.reset(obj, context);

    if (
      this.hasChangedField(
        "resizingVertical",
        "resizingHorizontal",
        "contraintsVertical",
        "contraintsHorizontal"
      ) ||
      this.changedLayout
    ) {
      this.refreshResizableCache();
    }

    return isChanged;
  }

  refreshResizableCache() {
    this.addCache("resizable", this.getAutoResizable());
  }

  get autoResizable() {
    return this.getCache("resizable");
  }

  /**
   * 크기 변경이 가능한지 체크한다.
   *
   * 크기가 자동으로 바뀌는 경우에 대해서 체크한다.
   *
   * 1. 상위 컴포넌트가 parent 가 아닌 경우
   * 2. 상위 컴포넌트가 layout 을 가지고 있는 경우
   * 3. resizing mode 가 fixed 아닌 경우
   * 4. constrains 가 none 이 아닌경우
   */
  getAutoResizable() {
    if (this.parent.is("project")) {
      return false;
    }

    if (
      this.resizingHorizontal === ResizingMode.FIXED &&
      this.resizingVertical === ResizingMode.FIXED
    ) {
      if (
        this.constraintsHorizontal === Constraints.NONE &&
        this.constraintsVertical === Constraints.NONE
      ) {
        return false;
      }
    }

    return true;
  }

  get layout() {
    return this.get("layout");
  }

  get constraintsHorizontal() {
    return this.get("constraintsHorizontal");
  }

  set constraintsHorizontal(value) {
    this.reset({
      constraintsHorizontal: value,
    });
  }

  get constraintsVertical() {
    return this.get("constraintsVertical");
  }

  set constraintsVertical(value) {
    this.reset({
      constraintsVertical: value,
    });
  }

  // flex
  get flexDirection() {
    return this.get("flexDirection");
  }
  set flexDirection(value) {
    this.reset({
      flexDirection: value,
    });
  }

  get flexWrap() {
    return this.get("flexWrap");
  }
  set flexWrap(value) {
    this.reset({
      flexWrap: value,
    });
  }

  get justifyContent() {
    return this.get("justifyContent");
  }

  set justifyContent(value) {
    this.reset({
      justifyContent: value,
    });
  }

  get alignItems() {
    return this.get("alignItems");
  }

  set alignItems(value) {
    this.reset({
      alignItems: value,
    });
  }

  get alignContent() {
    return this.get("alignContent");
  }

  set alignContent(value) {
    this.reset({
      alignContent: value,
    });
  }

  get order() {
    return this.get("order");
  }

  set order(value) {
    this.reset({
      order: value,
    });
  }

  get flexGrow() {
    return this.get("flexGrow");
  }

  set flexGrow(value) {
    this.reset({
      flexGrow: value,
    });
  }

  get flexShrink() {
    return this.get("flexShrink");
  }

  set flexShrink(value) {
    this.reset({
      flexShrink: value,
    });
  }

  get flexBasis() {
    return this.get("flexBasis");
  }

  set flexBasis(value) {
    this.reset({
      flexBasis: value,
    });
  }

  get gap() {
    return this.get("gap");
  }

  set gap(value) {
    this.reset({
      gap: value,
    });
  }

  get resizingHorizontal() {
    return this.get("resizingHorizontal");
  }

  set resizingHorizontal(value) {
    this.reset({
      resizingHorizontal: value,
    });
  }

  get resizingVertical() {
    return this.get("resizingVertical");
  }

  set resizingVertical(value) {
    this.reset({
      resizingVertical: value,
    });
  }

  // grid
  get gridTemplateRows() {
    return this.get("gridTemplateRows");
  }

  set gridTemplateRows(value) {
    this.reset({
      gridTemplateRows: value,
    });
  }

  get gridColumnGap() {
    return this.get("gridColumnGap");
  }

  set gridColumnGap(value) {
    this.reset({
      gridColumnGap: value,
    });
  }

  get gridTemplateColumns() {
    return this.get("gridTemplateColumns");
  }

  set gridTemplateColumns(value) {
    this.reset({
      gridTemplateColumns: value,
    });
  }

  get gridRowGap() {
    return this.get("gridRowGap");
  }

  set gridRowGap(value) {
    this.reset({
      gridRowGap: value,
    });
  }

  get gridTemplateAreas() {
    return this.get("gridTemplateAreas");
  }

  set gridTemplateAreas(value) {
    this.reset({
      gridTemplateAreas: value,
    });
  }

  get gridAutoRows() {
    return this.get("gridAutoRows");
  }

  set gridAutoRows(value) {
    this.reset({
      gridAutoRows: value,
    });
  }

  get gridAutoColumns() {
    return this.get("gridAutoColumns");
  }

  set gridAutoColumns(value) {
    this.reset({
      gridAutoColumns: value,
    });
  }

  get gridAutoFlow() {
    return this.get("gridAutoFlow");
  }

  set gridAutoFlow(value) {
    this.reset({
      gridAutoFlow: value,
    });
  }

  isLayoutItem() {
    return !!this.parent?.hasLayout();
  }

  /**
   * default layout 이고 constraints 값을 가지고 있으면
   *
   * @returns {boolean}
   */
  hasConstraints() {
    return this.isLayout(Layout.DEFAULT);
  }

  /**
   *
   * 레이아웃을 가지고 있는 container 인지 판별
   *
   * @returns {boolean}
   */
  hasLayout() {
    return !this.hasConstraints() || Boolean(this.layout) === false;
  }

  /**
   * layout 체크
   *
   * @param {default|flex|grid} layout
   * @returns {boolean}
   */
  isLayout(layout) {
    return this.layout === layout;
  }

  isInDefault() {
    const parentLayout = this.parent?.layout || "default";

    return Layout.DEFAULT === parentLayout;
  }

  isInGrid() {
    return this.isInLayout(Layout.GRID);
  }

  isInFlex() {
    return this.isInLayout(Layout.FLEX);
  }

  isInLayout(layout) {
    // if (!this.isLayoutItem()) return false;
    return this.parent?.layout === layout;
  }

  changeConstraints(direction, value, shiftKey = false) {
    const h = this.get(direction);
    let newConstraints = value;

    if (h === Constraints.MAX) {
      if (value === Constraints.MAX) {
        newConstraints = Constraints.SCALE;
      }
      if (shiftKey && value === Constraints.MIN) {
        newConstraints = Constraints.STRETCH;
      }
    } else if (h === Constraints.MIN) {
      if (value === Constraints.MIN) {
        newConstraints = Constraints.SCALE;
      } else if (shiftKey && value === Constraints.MAX) {
        newConstraints = Constraints.STRETCH;
      }
    } else if (h === Constraints.STRETCH) {
      if (value === Constraints.MIN) {
        newConstraints = Constraints.MAX;
      } else if (value === Constraints.MAX) {
        newConstraints = Constraints.MIN;
      }
    }

    this.reset({
      [direction]: newConstraints,
    });
  }

  startToCacheChildren() {
    LayoutEngine[this.layout]?.startCache(this);
  }

  /**
   * 상위 레이어에 맞게 자식 레이어의 공간(x,y,width,height)를 변경한다.
   */
  recoverChildren() {
    LayoutEngine[this.layout]?.recover(this);
  }
}
