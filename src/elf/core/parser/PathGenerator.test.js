import { beforeAll, expect, test } from "vitest";

import { PathGenerator } from "./PathGenerator";
import { PathParser } from "./PathParser";

let pathEditor = {};

beforeAll(() => {
  pathEditor = {};
});

test("create PathGenerator", () => {
  expect(new PathGenerator(pathEditor)).toBeInstanceOf(PathGenerator);
});

test("set selectedIndex", () => {
  const pathGenerator = new PathGenerator(pathEditor);
  pathGenerator.selectedIndex = 1;
  expect(pathGenerator.selectedIndex).toBe(1);
});

test("set convert PathGenerator", () => {
  const path = new PathParser(
    "M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100"
  );
  const pathGenerator = new PathGenerator(pathEditor);
  pathGenerator.setPoints(path.convertGenerator());

  expect(pathGenerator.points.length).toBe(4);
  expect(pathGenerator.points[0].startPoint.x).toBe(0);
  expect(pathGenerator.points[0].endPoint.x).toBe(20);
  expect(pathGenerator.points[0].curve).toBe(true);
  expect(pathGenerator.points[0].command).toBe("M");
});

test("get connected point list", () => {
  const path = new PathParser(
    "M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100 L 300 300 L 100 200 L 100 100"
  );
  const pathGenerator = new PathGenerator(pathEditor);
  pathGenerator.setPoints(path.convertGenerator());

  const connectedPointList = pathGenerator.getConnectedPointList(1);
  expect(connectedPointList.length).toBe(2);
  expect(connectedPointList[0].startPoint).toEqual({ x: 100, y: 100 });
});
