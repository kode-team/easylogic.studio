import { IntersectEpsilonNumberType } from "../types/editor";

import {
  intersectRectRect,
  polyPoly,
  vertiesToRectangle,
} from "elf/core/collision";

export default {
  startCache() {},

  recover() {},

  /**
   * px 로 된 위치를 기반으로 Grid Area 영역의 위치로 다시 맞춘다.
   *
   * @param {*} item
   */
  updateGridArea(currentItem, gridInformation, scale = 1) {
    if (currentItem.isInGrid() === false) return;

    const lastVerties = currentItem.originVerties;
    const targetRect = vertiesToRectangle(lastVerties);

    // grid area 의 정보를 얻기 위해서는 몇가지가 필요하다.
    // 1. lastVerties 의 각 꼭지점이 어느 grid 영역에 속하는지를 알아야 한다.
    // 2. 그런 이후 수집된 그리드 정보를 가지고 시작과 끝 영역을 분리해야한다.
    // 3. 그런 다음 grid-column-start, end, grid-row-start-end 를 처리하면 된다.
    const { items } = gridInformation;
    const epsilon = IntersectEpsilonNumberType.RECT / scale;
    const checkedGridRowColumnList = items
      .filter((it) => {
        return polyPoly(lastVerties, it.originVerties);
      })
      .filter((it) => {
        // 겹친 영역이 rect
        const intersect = intersectRectRect(it.originRect, targetRect);

        return (
          Math.floor(intersect.width) > epsilon &&
          Math.floor(intersect.height) > epsilon
        );
      });

    if (checkedGridRowColumnList.length === 0) return;

    const rows = checkedGridRowColumnList.map((it) => it.row);
    rows.sort((a, b) => a - b);

    const columns = checkedGridRowColumnList.map((it) => it.column);
    columns.sort((a, b) => a - b);

    const gridColumnStart = columns[0];
    const gridColumnEnd = columns[columns.length - 1];

    const gridRowStart = rows[0];
    const gridRowEnd = rows[rows.length - 1];

    const gridArea = {
      "grid-column-start": gridColumnStart,
      "grid-column-end": gridColumnEnd + 1,
      "grid-row-start": gridRowStart,
      "grid-row-end": gridRowEnd + 1,
    };

    currentItem.reset(gridArea);

    return gridArea;
  },
};
