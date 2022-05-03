import { expect, test } from "vitest";

import { intersectRectRect, Rect } from "./collision";

test("collision", () => {
  const rect1 = new Rect(1291, -1361, 268, 289);
  const rect2 = new Rect(1291 + 268, -1361, 268, 283);

  const intersect = intersectRectRect(rect1, rect2);

  expect(intersect.x).toBe(1559);
  expect(intersect.y).toBe(-1361);
  expect(intersect.width * intersect.height).toBe(0);
});
