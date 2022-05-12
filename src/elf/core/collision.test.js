import { expect, test } from "vitest";

import { intersectRectRect, polyPoly, Rect } from "./collision";

test("collision", () => {
  const rect1 = new Rect(1291, -1361, 268, 289);
  const rect2 = new Rect(1291 + 268, -1361, 268, 283);

  const intersect = intersectRectRect(rect1, rect2);

  expect(intersect.x).toBe(1559);
  expect(intersect.y).toBe(-1361);
  expect(intersect.width * intersect.height).toBe(0);
});

test("polyPoly", () => {
  const source = [
    [13898, 1595, 0],
    [16497, 1595, 0],
    [16497, 4429, 0],
    [13898, 4429, 0],
  ];

  const target = [
    [-301.52923134670806, -14088.644809594083, 0],
    [17038.470510267165, -14088.644809594083, 0],
    [17038.470510267165, 4911.354907283861, 0],
    [-301.52923134670806, 4911.354907283861, 0],
  ];

  const isCollision = polyPoly(source, target);

  expect(isCollision).toBe(true);
});
