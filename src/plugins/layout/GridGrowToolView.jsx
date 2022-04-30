import { vec3 } from "gl-matrix";

import {
  BIND,
  CLICK,
  DEBOUNCE,
  DOMDIFF,
  IF,
  LOAD,
  POINTERSTART,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  isString,
} from "sapa";

import "./GridGrowToolView.scss";

import { rectToVerties, vertiesToRectangle } from "elf/core/collision";
import { calculateAngle360, vertiesMap } from "elf/core/math";
import { iconUse } from "elf/editor/icon/icon";
import { Grid } from "elf/editor/property-parser/Grid";
import { END, FIRSTMOVE, MOVE } from "elf/editor/types/event";
import { Layout } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

class GridGrowBaseView extends EditorElement {
  updateRows(current, newRows) {
    const data = {};
    current.layers.forEach((it) => {
      data[it.id] = {
        "grid-row-start": Math.max(
          1,
          Math.min(newRows.length, it["grid-row-start"])
        ),
        "grid-row-end": Math.min(newRows.length + 1, it["grid-row-end"]),
      };
    });

    this.command("setAttributeForMulti", "change grid rows", {
      ...data,
      [current.id]: {
        "grid-template-rows": Grid.join(newRows),
      },
    });
  }

  updateColumns(current, newColumns) {
    const data = {};
    current.layers.forEach((it) => {
      data[it.id] = {
        "grid-column-start": Math.max(
          1,
          Math.min(newColumns.length, it["grid-column-start"])
        ),
        "grid-column-end": Math.min(
          newColumns.length + 1,
          it["grid-column-end"]
        ),
      };
    });

    this.command("setAttributeForMulti", "change grid columns", {
      ...data,
      [current.id]: {
        "grid-template-columns": Grid.join(newColumns),
      },
    });
  }

  updateColumnGap(current, columnGap) {
    this.command("setAttributeForMulti", "change grid column gap", {
      [current.id]: {
        "grid-column-gap": `${columnGap}`,
      },
    });
  }

  updateRowGap(current, rowGap) {
    this.command("setAttributeForMulti", "change grid row gap", {
      [current.id]: {
        "grid-row-gap": `${rowGap}`,
      },
    });
  }

  createNewGridItems(arr) {
    let newArr = [];
    if (arr.length === 0) {
      // 컬럼이 없으면 새로운 컬럼으로
      newArr = [Length.fr(1)];
    } else {
      newArr = [...arr, arr[arr.length - 1]];
    }

    return newArr;
  }

  copyNewGridItems(arr, index) {
    return [...arr.slice(0, index + 1), ...arr.slice(index)];
  }
}

class GridGrowClickEventView extends GridGrowBaseView {
  checkTargetLayer() {
    const current = this.getGridTargetLayer();

    if (!current) return false;

    if (current.isLayout(Layout.GRID) === false) return false;

    return true;
  }

  [CLICK("$grid .column-plus") + IF("checkTargetLayer")]() {
    const info = this.getGridLayoutInformation();

    this.updateColumns(info.current, this.createNewGridItems(info.columns));
  }

  [CLICK("$grid .row-plus") + IF("checkTargetLayer")]() {
    const info = this.getGridLayoutInformation();

    this.updateRows(info.current, this.createNewGridItems(info.rows));
  }

  [CLICK("$grid .column-delete") + IF("checkTargetLayer")](e) {
    const info = this.getGridLayoutInformation();

    if (info.columns.length < 2) {
      this.emit(
        "notify",
        "alert",
        "Alert",
        "Columns can not be less than one.",
        2000
      );
      return;
    }

    const index = +e.$dt.data("index");

    const newColumns = [
      ...info.columns.slice(0, index),
      ...info.columns.slice(index + 1),
    ];

    this.updateColumns(info.current, newColumns);
  }

  [CLICK("$grid .column-add") + IF("checkTargetLayer")](e) {
    const info = this.getGridLayoutInformation();
    const index = +e.$dt.data("index");

    this.updateColumns(
      info.current,
      this.copyNewGridItems(info.columns, index)
    );
  }

  [CLICK("$grid .row-add") + IF("checkTargetLayer")](e) {
    const info = this.getGridLayoutInformation();
    const index = +e.$dt.data("index");

    this.updateRows(info.current, this.copyNewGridItems(info.rows, index));
  }

  [CLICK("$grid .row-delete") + IF("checkTargetLayer")](e) {
    const info = this.getGridLayoutInformation();

    if (info.rows.length < 2) {
      this.emit(
        "notify",
        "alert",
        "Alert",
        "Rows can not be less than one.",
        2000
      );
      return;
    }

    const index = +e.$dt.data("index");

    const newRows = [
      ...info.rows.slice(0, index),
      ...info.rows.slice(index + 1),
    ];

    this.updateRows(info.current, newRows);
  }
}

class GridGrowDragEventView extends GridGrowClickEventView {
  [POINTERSTART("$gridGap .gap-tool.column-gap") +
    IF("checkTargetLayer") +
    FIRSTMOVE("moveFirstColumnGap") +
    MOVE("moveColumnGap") +
    END("moveEndColumnGap")](e) {
    const info = this.getGridLayoutInformation();

    this.current = info.current;
    this.columnGap = info.columnGap;
    this.lastColumnGap = info.columnGap;
    this.initMousePosition = this.$viewport.getWorldPosition(e);
  }

  updateGapPointer(gap) {
    const screenPosition = this.$viewport.applyVertex(
      this.$viewport.getWorldPosition()
    );

    this.refs.$pointer.text(`${gap}`);
    this.refs.$pointer.css({
      left: Length.px(screenPosition[0]),
      top: Length.px(screenPosition[1] + 20),
    });
  }

  moveFirstColumnGap() {
    this.refs.$pointer.show();
    this.updateGapPointer(this.columnGap);
  }

  moveColumnGap() {
    const targetPosition = this.$viewport.getWorldPosition();
    const newDist = vec3.subtract([], targetPosition, this.initMousePosition);

    // column 은 world 좌표 기준으로 100 이면 step: 1의 비율로 치자.
    // step 에 따라 달라진다.
    const stepRate = newDist[0] / 100;
    const columnGap = this.columnGap;
    let newColumnGap = columnGap;
    if (columnGap instanceof Length) {
      if (columnGap.isPercent()) {
        newColumnGap = Length.percent(
          Math.max(columnGap.value + stepRate * 5, 0)
        ).round(1000);
      } else if (columnGap.isPx()) {
        newColumnGap = Length.px(
          Math.max(columnGap.value + stepRate * 100, 0)
        ).floor();
      }
    }

    this.lastColumnGap = newColumnGap;
    this.updateColumnGap(this.current, newColumnGap);

    this.updateGapPointer(this.lastColumnGap);
  }

  moveEndColumnGap() {
    const targetPosition = this.$viewport.getWorldPosition();
    const realDistance = vec3.dist(targetPosition, this.initMousePosition);

    // gap 단위 변경
    if (realDistance < 1) {
      if (this.lastColumnGap.isPx()) {
        this.lastColumnGap = Length.makePercent(
          this.lastColumnGap.value,
          this.current.screenWidth
        );
      } else {
        this.lastColumnGap = this.lastColumnGap.toPx(this.current.screenWidth);
      }
    }

    this.updateColumnGap(this.current, this.lastColumnGap);

    this.refs.$pointer.hide();
  }

  [POINTERSTART("$gridGap .gap-tool.row-gap") +
    IF("checkTargetLayer") +
    FIRSTMOVE("moveFirstColumnGap") +
    MOVE("moveRowGap") +
    END("moveEndRowGap")](e) {
    const info = this.getGridLayoutInformation();

    this.current = info.current;
    this.rowGap = info.rowGap;
    this.lastColumnGap = info.rowGap;
    this.initMousePosition = this.$viewport.getWorldPosition(e);
  }

  moveRowGap() {
    const targetPosition = this.$viewport.getWorldPosition();
    const newDist = vec3.subtract([], targetPosition, this.initMousePosition);

    // column 은 world 좌표 기준으로 100 이면 step: 1의 비율로 치자.
    // step 에 따라 달라진다.
    const stepRate = newDist[1] / 100;
    const rowGap = this.rowGap;
    let newRowGap = rowGap;
    if (rowGap instanceof Length) {
      if (rowGap.isPercent()) {
        newRowGap = Length.percent(
          Math.max(rowGap.value + stepRate * 5, 0)
        ).round(1000);
      } else if (rowGap.isPx()) {
        newRowGap = Length.px(
          Math.max(rowGap.value + stepRate * 100, 0)
        ).floor();
      }
    }

    this.lastRowGap = newRowGap;
    this.updateRowGap(this.current, newRowGap);

    this.updateGapPointer(this.lastRowGap);
  }

  moveEndRowGap() {
    const targetPosition = this.$viewport.getWorldPosition();
    const realDistance = vec3.dist(targetPosition, this.initMousePosition);

    // gap 단위 변경
    if (realDistance < 1) {
      if (!this.lastRowGap) {
        this.lastRowGap = Length.px(0);
      }

      if (this.lastRowGap.isPx()) {
        this.lastRowGap = Length.makePercent(
          this.lastRowGap.value,
          this.current.screenHeight
        );
      } else {
        this.lastRowGap = this.lastRowGap.toPx(this.current.screenHeight);
      }
    }

    this.updateRowGap(this.current, this.lastRowGap);

    this.refs.$pointer.hide();
  }

  [POINTERSTART("$grid .grid-item-tool.column .item") +
    MOVE("moveColumn") +
    END("moveEndColumn")](e) {
    const index = +e.$dt.data("index");

    const info = this.getGridLayoutInformation();
    this.current = info.current;
    this.columns = info.columns;
    this.selectedColumnIndex = index;
    this.selectedColumnWidth = info.columns[index];
    this.initMousePosition = this.$viewport.getWorldPosition(e);
  }

  moveColumn() {
    const targetPosition = this.$viewport.getWorldPosition();
    const newDist = vec3.subtract([], targetPosition, this.initMousePosition);

    // column 은 world 좌표 기준으로 100 이면 step: 1의 비율로 치자.
    // step 에 따라 달라진다.
    const stepRate = newDist[0] / 100;
    const columnWidth = this.selectedColumnWidth;
    if (columnWidth instanceof Length) {
      if (columnWidth.isPercent()) {
        var newWidth = Math.max(columnWidth.value + stepRate * 5, 1);
        this.columns[this.selectedColumnIndex] =
          Length.percent(newWidth).round(1000);
      } else if (columnWidth.isPx()) {
        var newWidth = Math.max(10, columnWidth.value + stepRate * 100);
        this.columns[this.selectedColumnIndex] = Length.px(newWidth).floor();
      } else if (columnWidth.isFr()) {
        var newWidth = Math.max(
          columnWidth.value + Math.floor(newDist[0] / 20) * 0.25,
          0.25
        );
        this.columns[this.selectedColumnIndex] = Length.fr(newWidth);
      } else {
        var newWidth = Math.max(columnWidth.value + stepRate * 1, 10);
        this.columns[this.selectedColumnIndex] = new Length(
          newWidth,
          columnWidth.unit
        );
      }

      this.updateColumns(this.current, this.columns);
    }
  }

  /**
   * column size 의 를 변경한다.
   *
   * px -> %
   * % -> fr
   * fr -> auto
   * auto -> px
   */
  changedColumnSize() {
    const info = this.getGridLayoutInformation();

    const index = this.selectedColumnIndex;
    const width = this.selectedColumnWidth;

    if (width instanceof Length) {
      if (width.isPercent()) {
        this.columns[index] = Length.fr(1);
      } else if (width.isPx()) {
        this.columns[index] = Length.makePercent(
          width.value,
          info.current.screenWidth
        ).round(1000);
      } else if (width.isFr()) {
        this.columns[index] = "auto";
      }
    } else if (width === "auto") {
      const { items } = this.state.lastGridInfo;

      const column = items.find((it) => it.column === index + 1);

      this.columns[index] = Length.px(column.rect.width).floor();
    }
  }

  moveEndColumn() {
    const targetPosition = this.$viewport.getWorldPosition();
    // const newDist = vec3.subtract([], targetPosition, this.initMousePosition);

    const realDistance = vec3.dist(targetPosition, this.initMousePosition);

    if (realDistance < 1) {
      // open 팝업 창 띄우기
      // column 정보를 바꾸기 위한 팝업창
      // 크기 패턴 바꾸기 팝업창
      this.changedColumnSize();
    }

    this.updateColumns(this.current, this.columns);
  }

  [POINTERSTART("$grid .grid-item-tool.row .item") +
    MOVE("moveRow") +
    END("moveEndRow")](e) {
    const index = +e.$dt.data("index");

    const info = this.getGridLayoutInformation();
    this.current = info.current;
    this.rows = info.rows;
    this.selectedRowIndex = index;
    this.selectedRowHeight = info.rows[index];
    this.initMousePosition = this.$viewport.getWorldPosition(e);
  }

  moveRow() {
    const targetPosition = this.$viewport.getWorldPosition();
    const newDist = vec3.subtract([], targetPosition, this.initMousePosition);

    // column 은 world 좌표 기준으로 100 이면 step: 1의 비율로 치자.
    // step 에 따라 달라진다.
    const stepRate = newDist[1] / 30;
    const rowHeight = this.selectedRowHeight;
    if (rowHeight instanceof Length) {
      if (rowHeight.isPercent()) {
        var newHeight = Math.max(rowHeight.value - stepRate * 5, 1);
        this.rows[this.selectedRowIndex] =
          Length.percent(newHeight).round(1000);
      } else if (rowHeight.isPx()) {
        var newHeight = Math.max(10, rowHeight.value - stepRate * 100);
        this.rows[this.selectedRowIndex] = Length.px(newHeight).floor();
      } else if (rowHeight.isFr()) {
        var newHeight = Math.max(
          rowHeight.value + Math.floor(newDist[1] / 20) * 0.25,
          0.25
        );
        this.rows[this.selectedRowIndex] = Length.fr(newHeight);
      } else {
        var newHeight = Math.max(rowHeight.value - stepRate * 1, 10);
        this.rows[this.selectedRowIndex] = new Length(
          newHeight,
          rowHeight.unit
        );
      }

      this.updateRows(this.current, this.rows);
    }
  }

  /**
   * column size 의 를 변경한다.
   *
   * px -> %
   * % -> fr
   * fr -> auto
   * auto -> px
   */
  changedRowSize() {
    const info = this.getGridLayoutInformation();

    const index = this.selectedRowIndex;
    const height = this.selectedRowHeight;

    if (height instanceof Length) {
      if (height.isPercent()) {
        this.rows[index] = Length.fr(1);
      } else if (height.isPx()) {
        this.rows[index] = Length.makePercent(
          height.value,
          info.current.screenHeight
        ).round(1000);
      } else if (height.isFr()) {
        this.rows[index] = "auto";
      }
    } else if (height === "auto") {
      const { items } = this.state.lastGridInfo;

      const row = items.find((it) => it.row === index + 1);

      this.rows[index] = Length.px(row.rect.height).floor();
    }
  }

  moveEndRow() {
    const targetPosition = this.$viewport.getWorldPosition();
    const realDistance = vec3.dist(targetPosition, this.initMousePosition);

    if (realDistance < 1) {
      // open 팝업 창 띄우기
      // column 정보를 바꾸기 위한 팝업창
      // 크기 패턴 바꾸기 팝업창
      this.changedRowSize();
    }

    this.updateRows(this.current, this.rows);
  }
}

export default class GridGrowToolView extends GridGrowDragEventView {
  template() {
    return (
      <div class="elf--grid-grow-tool-view">
        <div class="layout-rect" ref="$grid"></div>
        <div class="layout-rect blank-tool" ref="$gridGap"></div>
        <div class="layout-pointer" ref="$pointer"></div>
      </div>
    );
  }

  [BIND("$el")]() {
    const current = this.getGridTargetLayer();

    return {
      "data-drag-target-item": Boolean(this.$context.selection.dragTargetItem),
      "data-grid-layout-own": this.$context.selection.current?.id === current?.id,
      style: {
        display: current ? "block" : "none",
      },
    };
  }

  [BIND("$grid")]() {
    const current = this.getGridTargetLayer();

    if (!current) return "";

    if (current.isLayout(Layout.GRID) === false) return "";

    const rect = vertiesToRectangle(
      this.$viewport.applyVerties(current.verties)
    );

    const info = this.getGridLayoutInformation();

    const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
      this.getScaledInformation([
        Length.px(info.current["padding-top"]),
        Length.px(info.current["padding-right"]),
        Length.px(info.current["padding-bottom"]),
        Length.px(info.current["padding-left"]),
      ]);
    const columns = this.getScaledInformation(info.columns);
    const rows = this.getScaledInformation(info.rows);

    const columnGap = this.getScaledLength(info.columnGap);
    const rowGap = this.getScaledLength(info.rowGap);

    const origin = vec3.subtract([], current.verties[1], current.verties[0]);
    const angle = calculateAngle360(origin[0], origin[1]) - 180;

    return {
      style: {
        display: "grid",
        "grid-template-columns": Grid.join(columns),
        "grid-template-rows": Grid.join(rows),
        "grid-column-gap": columnGap,
        "grid-row-gap": rowGap,
        left: Length.px(rect.left),
        top: Length.px(rect.top),
        width: Length.px(rect.width),
        height: Length.px(rect.height),
        "padding-top": paddingTop,
        "padding-right": paddingRight,
        "padding-bottom": paddingBottom,
        "padding-left": paddingLeft,
        "transform-origin": "left top",
        transform: `rotate(${angle}deg)`,
      },
    };
  }

  [BIND("$gridGap")]() {
    const current = this.getGridTargetLayer();

    if (!current) return "";

    if (current.isLayout(Layout.GRID) === false) return "";

    const rect = vertiesToRectangle(
      this.$viewport.applyVerties(current.verties)
    );

    const origin = vec3.subtract([], current.verties[1], current.verties[0]);
    const angle = calculateAngle360(origin[0], origin[1]) - 180;

    return {
      style: {
        left: Length.px(rect.left),
        top: Length.px(rect.top),
        width: Length.px(rect.width),
        height: Length.px(rect.height),
        "transform-origin": "left top",
        transform: `rotate(${angle}deg)`,
      },
    };
  }

  getScaledInformation(arr) {
    return arr.map((it) => this.getScaledLength(it));
  }

  getScaledLength(it) {
    if (isString(it)) {
      return it;
    } else if (it instanceof Length) {
      if (it.isPx()) {
        return it.clone().mul(this.$viewport.scale);
      }
    }

    return it;
  }

  getGridTargetLayer() {
    if (this.$context.selection.dragTargetItem) {
      return this.$context.selection.dragTargetItem;
    }

    const current = this.$context.selection.current;

    if (!current) return null;

    if (current.isLayout(Layout.GRID)) return current;

    const parent = current.parent;

    if (parent && parent.is("project")) return null;

    if (parent && parent.isLayout(Layout.GRID)) return parent;

    return null;
  }

  getParsedValue(it) {
    if (it === "auto") {
      return it;
    }

    return Length.parse(it);
  }

  getGridLayoutInformation() {
    const current = this.getGridTargetLayer();
    const columns = Grid.parseStyle(current["grid-template-columns"]);
    const rows = Grid.parseStyle(current["grid-template-rows"]);

    return {
      current,
      columns,
      columnGap: this.getParsedValue(current["grid-column-gap"]),
      rows,
      rowGap: this.getParsedValue(current["grid-row-gap"]),
    };
  }

  // load 이후에 실행되는 함수
  afterLoadRendering(targetRef, refName) {
    // load 이후에 개별 셀 들의 offsetRect 정보를 저장한다.
    this.trigger("refreshGridInformation", targetRef, refName);
  }

  [SUBSCRIBE_SELF("refreshGridInformation") + DEBOUNCE(10)](
    targetRef,
    refName
  ) {
    const current = this.getGridTargetLayer();

    if (!current) return;

    if (current.isLayout(Layout.GRID) === false) return;

    if (refName !== "$grid") return;

    const info = this.getGridLayoutInformation();

    const scale = this.$viewport.scale;
    const items = targetRef.$$(".grid-item").map((it) => {
      const [row, column] = it
        .attrs("data-row", "data-column")
        .map((it) => +it);
      const { x, y, width, height } = it.offsetRect();
      const rect = {
        x: x / scale,
        y: y / scale,
        width: width / scale,
        height: height / scale,
      };

      const verties = vertiesMap(
        rectToVerties(rect.x, rect.y, rect.width, rect.height),
        info.current.absoluteMatrix
      );

      const originVerties = verties.filter((_, index) => index < 4);

      return {
        row,
        column,
        rect,
        info,

        // world position
        verties,
        originVerties,
        originRect: vertiesToRectangle(originVerties),
      };
    });

    // 마지막 grid 정보
    this.state.lastGridInfo = { info, items };

    // 마지막 공백 구간 설정
    this.load("$gridGap");

    this.$context.selection.updateGridInformation({
      info,
      items,
    });
  }

  [LOAD("$gridGap") + DOMDIFF]() {
    const current = this.getGridTargetLayer();

    if (!current) return "";

    if (!this.$context.selection.current) return "";

    const last = this.state.lastGridInfo;
    const scale = this.$viewport.scale;
    if (!last) return "";
    const { info, items } = last;

    const { columns, rows } = info;

    const result = [];

    // collect column gap box area
    const rowItems = items.filter((it) => it.column === 1);
    const columnItems = items.filter((it) => it.row === 1);

    const minY = Math.min(...rowItems.map((it) => it.verties[0][1]));
    const maxY = Math.max(...rowItems.map((it) => it.verties[2][1]));
    const h = maxY - minY;

    for (
      var columnIndex = 1, len = columns.length;
      columnIndex < len && columnItems.length;
      columnIndex++
    ) {
      const prevCell = columnItems[columnIndex - 1];
      const cell = columnItems[columnIndex];

      const x = prevCell.rect.x + prevCell.rect.width;
      const w = cell.rect.x - x;
      const y = prevCell.rect.y;

      result.push({
        type: "column-gap",
        index: columnIndex,
        x,
        y,
        width: w,
        height: h,
      });
    }

    // collect row gap box area

    const minX = Math.min(...columnItems.map((it) => it.verties[0][0]));
    const maxX = Math.max(...columnItems.map((it) => it.verties[2][0]));
    const w = maxX - minX;

    for (var rowIndex = 1, len = rows.length; rowIndex < len; rowIndex++) {
      const prevCell = rowItems[rowIndex - 1];
      const cell = rowItems[rowIndex];

      const y = prevCell.rect.y + prevCell.rect.height;
      const h = cell.rect.y - y;
      const x = prevCell.rect.x;

      result.push({
        type: "row-gap",
        index: rowIndex,
        x,
        y,
        width: w,
        height: h,
      });
    }

    return result.map((it) => {
      if (it.type === "column-gap") {
        return (
          <div
            class="gap-tool column-gap"
            style={{
              left: Length.px(it.x * scale),
              top: Length.px(it.y * scale),
              width: Length.px(Math.max(it.width * scale, 5)),
              height: Length.px(it.height * scale),
            }}
          ></div>
        );
      } else if (it.type === "row-gap") {
        return (
          <div
            class="gap-tool row-gap"
            style={{
              left: Length.px(it.x * scale),
              top: Length.px(it.y * scale),
              height: Length.px(Math.max(it.height * scale, 5)),
              width: Length.px(it.width * scale),
            }}
          ></div>
        );
      }

      return "";
    });
  }

  isSelectedColumn(index) {
    const current = this.$context.selection.current;

    return (
      current["grid-column-start"] <= index &&
      index < current["grid-column-end"]
    );
  }

  isSelectedRow(index) {
    const current = this.$context.selection.current;

    return (
      current["grid-row-start"] <= index && index < current["grid-row-end"]
    );
  }

  [LOAD("$grid") + DOMDIFF]() {
    const current = this.getGridTargetLayer();

    if (!current) return "";

    if (current.isLayout(Layout.GRID) === false) return "";

    const info = this.getGridLayoutInformation();

    const totalCount = info.columns.length * info.rows.length;

    const isChild = this.$context.selection.current?.id !== info.current.id;

    return (
      <>
        {Array.from(Array(info.columns.length).keys()).map((index) => {
          const selected =
            isChild && this.isSelectedColumn(index + 1) ? "selected" : "";

          return (
            <div
              class={`grid-item-tool column ${selected}`}
              data-index={index}
              style={{
                "grid-column": `${index + 1} / span 1`,
                "grid-row": `1 / span 1`,
              }}
            >
              <div class="grid-item-tool-inner">
                <div class="item" data-index={index}>
                  <span>{info.columns[index]}</span>
                </div>
                <div class="drag-handle right">
                  <div
                    class="column-delete"
                    data-index={index}
                    title={`Delete ${info.columns[index]}`}
                  >
                    {iconUse("close")}
                  </div>
                  <div
                    class="column-add"
                    data-index={index}
                    title={`Add ${info.columns[index]}`}
                  >
                    {iconUse("add")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* column plus */}
        <div
          class="grid-item-tool append column-plus"
          style={{
            "grid-column": `${info.columns.length} / span 1`,
            "grid-row": `1 / span 1`,
          }}
        >
          {iconUse("add")}
        </div>

        {Array.from(Array(info.rows.length).keys()).map((index) => {
          const selected =
            isChild && this.isSelectedRow(index + 1) ? "selected" : "";
          return (
            <>
              <div
                class={`grid-item-tool row ${selected}`}
                style={{
                  "grid-row": `${index + 1} / span 1`,
                  "grid-column": `1 / span 1`,
                }}
              >
                <div class="grid-item-tool-inner">
                  <div class="item" data-index={index}>
                    <span>{info.rows[index]}</span>
                  </div>
                  <div class="drag-handle bottom">
                    <div
                      class="row-delete"
                      data-index={index}
                      title={`Delete ${info.rows[index]}`}
                    >
                      {iconUse("close")}
                    </div>
                    <div
                      class="row-add"
                      data-index={index}
                      title={`Add ${info.rows[index]}`}
                    >
                      {iconUse("add")}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}

        {/* row plus */}
        <div
          class="grid-item-tool append row-plus"
          style={{
            "grid-row": `${info.rows.length} / span 1`,
            "grid-column": `1 / span 1`,
          }}
        >
          {iconUse("add")}
        </div>

        {Array.from(Array(totalCount).keys()).map((i) => {
          const column = i % info.columns.length;
          const row = Math.floor(i / info.columns.length);

          return (
            <>
              <div
                class="grid-item"
                data-row={row + 1}
                data-column={column + 1}
                style={{
                  "grid-column": `${column + 1} / span 1`,
                  "grid-row": `${row + 1} / span 1`,
                }}
              ></div>
            </>
          );
        })}
      </>
    );
  }

  [SUBSCRIBE("refreshGridToolInfo")]() {
    this.refresh();
  }

  [SUBSCRIBE("updateViewport")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelectionStyleView")]() {
    this.refresh();
  }
}
