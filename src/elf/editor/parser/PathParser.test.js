import { expect, test } from "vitest";

import { PathParser } from "./PathParser";

test("create PathParser", () => {
  expect(new PathParser()).toBeInstanceOf(PathParser);
});

test("create PathParser with path d", () => {
  const path = new PathParser("M0,0L1,1");
  expect(path.d).toBe("M 0 0L 1 1");
});

test("path translate", () => {
  const path = new PathParser("M0,0L1,1");
  path.translate(10, 10);
  expect(path.d).toBe("M 10 10L 11 11");
});

test("path scale", () => {
  const path = new PathParser("M0,0L1,1");
  path.scale(2, 0);
  expect(path.d).toBe("M 0 0L 2 0");
});

test("path rotate", () => {
  const path = new PathParser("M0,0L4,0");
  path.rotate(45);
  expect(path.d).toBe("M 0 0L 2.8284270763397217 2.8284270763397217");
});

test("path bbox for point", () => {
  const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
  expect(path.getBBox()).toEqual([
    [0, 0, 0],
    [4, 0, 0],
    [4, 4, 0],
    [0, 4, 0],
  ]);
});

test("path bbox for curve", () => {
  const path = new PathParser("M0,0 C 10 10, 20 20, 30 30");

  expect(path.getBBox()).toEqual([
    [0, 0, 0],
    [30, 0, 0],
    [30, 30, 0],
    [0, 30, 0],
  ]);
});

test("path bbox for multi segment", () => {
  const path = new PathParser(
    "M 37.93732341720084 0C 81.2916762789344 0 -5.417029444532609 35.59336238843551 139.0385024508094 72.37594604492188C -5.417029444532609 123.40663761156449 139.0385024508094 155.75717163085938 95.68414958907584 155.75717163085938C 52.32979672734239 155.75717163085938 -40.56267658279916 123.40663761156449 103.89285531254285 72.37594604492188C -40.56267658279916 35.59336238843551 -5.417029444532609 0 37.93732341720084 0Z"
  );
  const rect = path.rect();
  expect(rect.width).toBe(139.0385024508094);
  expect(rect.height).toBe(155.75717163085938);
});

test("path reset", () => {
  const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
  path.reset("M0,0 L10,10");
  expect(path.d).toBe("M 0 0L 10 10");
});

test("path segment list", () => {
  const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
  expect(path.segments).toEqual([
    { command: "M", values: [0, 0] },
    { command: "L", values: [4, 0] },
    { command: "L", values: [4, 4] },
    { command: "L", values: [0, 4] },
  ]);
});

test("path - closed point in line", () => {
  const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
  expect(path.getClosedPoint({ x: 10, y: 10 }, 20)).toEqual({ x: 4, y: 4 });
});

test("path - closed point in curve", () => {
  const path = new PathParser("M0,0 C20,30 50,40 100,100");
  expect(path.getClosedPoint({ x: 10, y: 10 }, 20)).toEqual({
    x: 8.843183593749998,
    y: 11.422597656249998,
  });
});

test("path - center pointer list", () => {
  const path = new PathParser("M0,0 C20,30 50,40 100,100");
  expect(path.getCenterPointers()).toEqual([
    { index: 0, pointer: [0, 0, 0] },
    { index: 1, pointer: [100, 100, 0] },
  ]);

  path.reset("M0,0 C20,30 50,40 100,100 Q 20 30 70 70");
  expect(path.getCenterPointers()).toEqual([
    { index: 0, pointer: [0, 0, 0] },
    { index: 1, pointer: [100, 100, 0] },
    { index: 2, pointer: [70, 70, 0] },
  ]);
});

test("path - same pointer list", () => {
  const path = new PathParser(
    "M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100"
  );
  expect(path.getSamePointers([100, 100, 0])).toEqual([
    { index: 1, pointer: [100, 100, 0] },
    { index: 3, pointer: [100, 100, 0] },
  ]);

  expect(path.getSamePointers([100, 100, 0], 70)).toEqual([
    { index: 1, pointer: [100, 100, 0] },
    { index: 2, pointer: [70, 70, 0] },
    { index: 3, pointer: [100, 100, 0] },
  ]);
});

test("path group - two path group check", () => {
  const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
        M10,10 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
    `);

  expect(path.getGroup()).toEqual([
    {
      index: 0,
      groupIndex: 0,
      segments: [
        { index: 0, segment: { command: "M", values: [0, 0] } },
        {
          index: 1,
          segment: { command: "C", values: [20, 30, 50, 40, 100, 100] },
        },
        { index: 2, segment: { command: "Q", values: [20, 30, 70, 70] } },
        { index: 3, segment: { command: "L", values: [100, 100] } },
      ],
    },
    {
      index: 4,
      groupIndex: 1,
      segments: [
        { index: 4, segment: { command: "M", values: [10, 10] } },
        {
          index: 5,
          segment: { command: "C", values: [20, 30, 50, 40, 100, 100] },
        },
        { index: 6, segment: { command: "Q", values: [20, 30, 70, 70] } },
        { index: 7, segment: { command: "L", values: [100, 100] } },
      ],
    },
  ]);
});

test("path - create group path", () => {
  const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
        M10,10 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
    `);

  expect(path.createGroupPath(0).d).toBe(
    "M 0 0C 20 30 50 40 100 100Q 20 30 70 70L 100 100"
  );
  expect(path.createGroupPath(1).d).toBe(
    "M 10 10C 20 30 50 40 100 100Q 20 30 70 70L 100 100"
  );
});

test("path - split bezier curve path by point", () => {
  const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
    `);

  path.splitSegmentByPoint({ x: 10, y: 10 }, 20);

  expect(path.d).toBe(
    "M 0 0C 2.7499999999999996 4.124999999999999 5.689062499999999 7.871874999999999 8.843183593749998 11.422597656249998C 28.628125 33.6953125 56.875 48.25 100 100Q 20 30 70 70L 100 100"
  );
});

test("path - split quard curve path by point", () => {
  const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 200 200 300 100
    `);

  path.splitSegmentByPoint({ x: 150, y: 150 }, 20);

  expect(path.d).toBe(
    "M 0 0C 20 30 50 40 100 100Q 127.5 127.5 155 139.875Q 227.5 172.5 300 100"
  );
});

test("path - normalize , convert line to cubic bezier curve", () => {
  const path = new PathParser(`M0,0 L 100 100`);
  const path2 = path.normalize();

  expect(path2.d).toBe("M 0 0C 33 33 66 66 100 100");
});

test("path - normalize , convert curve to cubic bezier curve", () => {
  const path = new PathParser(`M0,0 C20,30 50,40 100,100`);
  const path2 = path.normalize();

  expect(path2.d).toBe("M 0 0C 20 30 50 40 100 100");
});

test("path - normalize , convert quard curve to cubic bezier curve", () => {
  const path = new PathParser(`M0,0 Q200 200 300 100`);
  const path2 = path.normalize();

  expect(path2.d).toBe(
    "M 0 0C 133.3333282470703 133.3333282470703 233.3333282470703 166.6666717529297 300 100"
  );
});

test("path - normalize with Z, convert quard curve to cubic bezier curve", () => {
  const path = new PathParser(`M0,0 Q200 200 300 100 Z`);
  const path2 = path.normalize();

  expect(path2.d).toBe(
    "M 0 0C 133.3333282470703 133.3333282470703 233.3333282470703 166.6666717529297 300 100Z"
  );
});

test("path - normalize with Z, convert quard curve to cubic bezier curve", () => {
  const path = new PathParser(
    `M0,0 L 100 100C 20 30 50 40 100 100 Q200 200 300 100 Z`
  );
  const path2 = path.normalize();

  expect(path2.d).toBe(
    "M 0 0C 33 33 66 66 100 100C 20 30 50 40 100 100C 166.6666717529297 166.6666717529297 233.3333282470703 166.6666717529297 300 100Z"
  );
});

test("path - divide line segment by count", () => {
  const path = new PathParser("M0, 0L50 50");

  const path2 = path.divideSegmentByCount(5);

  expect(path2.d).toBe(
    "M 0 0L 10 10L 18 18L 24.4 24.4L 29.52 29.52L 33.616 33.616"
  );
});

test("path - divide quard curve segment by count", () => {
  const path = new PathParser("M0, 0 Q5 5 10 0");

  const path2 = path.divideSegmentByCount(5);

  expect(path2.d).toBe(
    "M 0 0Q 1 1 2 1.6Q 3 2.2 4 2.4000000000000004Q 5 2.6 6 2.4Q 7 2.2 8 1.6Q 9 1 10 0"
  );
});

test("path - divide bezier curve segment by count", () => {
  const path = new PathParser("M0, 0 C 200 200 200 200 300 100");

  const path2 = path.divideSegmentByCount(5);

  expect(path2.d).toBe(
    "M 0 0C 40 40 72 72 98.4 96.8C 124.80000000000001 121.6 145.60000000000002 139.2 163.20000000000002 150.39999999999998C 180.8 161.6 195.20000000000002 166.4 208.8 165.6C 222.4 164.8 235.2 158.4 249.6 147.2C 264 136 280 120 300 100"
  );
});

test("path - reverse", () => {
  const path = new PathParser("M0, 0L50 50");

  path.reverse();

  expect(path.d).toBe("M 50 50L 0 0");
});

test("path - reverse with multi points", () => {
  const path = new PathParser("M0, 0L50 50 L100 100 L 300 300");

  path.reverse();

  expect(path.d).toBe("M 300 300L 100 100L 50 50L 0 0");
});

test("path - reverse with Z", () => {
  const path = new PathParser("M0, 0L50 50 L100 100 L 300 300 Z");

  path.reverse();

  expect(path.d).toBe("M 300 300L 100 100L 50 50L 0 0Z");
});

test("path - reverse with curve", () => {
  const path = new PathParser("M0, 0L50 50 C100 100  300 300 100 100 Z");

  path.reverse();

  expect(path.d).toBe("M 100 100C 300 300 100 100 50 50L 0 0Z");
});

test("path - reverse with multi path", () => {
  const path = new PathParser(
    "M0, 0L50 50 C100 100  300 300 100 100 Z M 200, 300 L 400 500"
  );

  path.reverse();

  expect(path.d).toBe(
    "M 100 100C 300 300 100 100 50 50L 0 0Z M 400 500L 200 300"
  );
});

test("path - reverse by groupIndex", () => {
  const path = new PathParser(
    "M0, 0L50 50 C100 100  300 300 100 100 Z M 200, 300 L 400 500"
  );

  path.reverse(1);

  expect(path.d).toBe(
    "M 0 0L 50 50C 100 100 300 300 100 100Z M 400 500L 200 300"
  );
});

test("path - smooth splines", () => {
  const path = new PathParser("M0, 0L50 50 L 100 50 L 300 20 L 20 20");

  const newPath = path.cardinalSplines();

  expect(newPath.d).toBe(
    "M 0 0Q 25 37.5 50 50C 75 62.5 37.5 57.5 100 50C 162.5 42.5 320 27.5 300 20Q 280 12.5 20 20"
  );
});

test("path - smooth splines - rect", () => {
  const path = new PathParser("M0, 0L10, 0 L10,10 L0,10 L0,0");

  const newPath = path.cardinalSplines(1);

  expect(newPath.d).toBe(
    "M 0 0C 0 0 10 0 10 0C 10 0 10 10 10 10C 10 10 0 10 0 10C 0 10 0 0 0 0"
  );

  const newPath2 = path.cardinalSplines(0);

  expect(newPath2.d).toBe(
    "M 0 0C 5 -5 5 -5 10 0C 15 5 15 5 10 10C 5 15 5 15 0 10C -5 5 -5 5 0 0"
  );
});

test("path - fitting curve by points ", () => {
  const path = new PathParser(
    "M 0 122.90921364435849L 0 106.50889973607832L 3.974220849319181 98.11890227925733L 39.13003173519451 58.60900701730611L 73.2714617175991 34.81146602253739L 92.88389664355282 24.463780589890803L 116.30540706085458 14.86523596986217L 145.6920086928667 5.846817350911579L 210.6542204186826 0L 287.7861556523917 0L 305.01318196605916 2.9906130530034716L 492.9729841955723 51.133076705400526L 538.1465183366627 56.6745722671717L 582.64793569372 56.6745722671717L 623.3702110681688 50.89557986654995L 636.1522573511738 46.49739832150203L 641.449320261094 42.52456463478302L 648.0143958046317 27.508967539924697L 648.4892434652172 5.410591217455703"
  );

  const newPath = path.smooth(50);

  expect(newPath.d).toBe(
    "M 0 122.90921364435849C 0 6.546834127221473 218.0650580703252 -2.209740559660218 287.7861556523917 0C 304.58489100025656 0.5324191404973357 645.6752903366187 136.36584350380713 648.4892434652172 5.410591217455703"
  );
});

test("path - simplify by points", () => {
  const path = new PathParser(
    "M 0 122.90921364435849L 0 106.50889973607832L 3.974220849319181 98.11890227925733L 39.13003173519451 58.60900701730611L 73.2714617175991 34.81146602253739L 92.88389664355282 24.463780589890803L 116.30540706085458 14.86523596986217L 145.6920086928667 5.846817350911579L 210.6542204186826 0L 287.7861556523917 0L 305.01318196605916 2.9906130530034716L 492.9729841955723 51.133076705400526L 538.1465183366627 56.6745722671717L 582.64793569372 56.6745722671717L 623.3702110681688 50.89557986654995L 636.1522573511738 46.49739832150203"
  );

  const newPath = path.simplify(0.1);

  expect(newPath.d).toBe(
    "M 0 122.90921364435849L 0 106.50889973607832L 3.974220849319181 98.11890227925733L 39.13003173519451 58.60900701730611L 73.2714617175991 34.81146602253739L 92.88389664355282 24.463780589890803L 116.30540706085458 14.86523596986217L 145.6920086928667 5.846817350911579L 210.6542204186826 0L 287.7861556523917 0L 305.01318196605916 2.9906130530034716L 492.9729841955723 51.133076705400526L 538.1465183366627 56.6745722671717L 582.64793569372 56.6745722671717L 623.3702110681688 50.89557986654995L 636.1522573511738 46.49739832150203"
  );
});

test("path - custom transform", () => {
  const path = new PathParser("M 0 0 L 10 0 L 10 10 L 0 10");

  const newPath = path.divideSegmentByCount(4);
  newPath.transform(([x, y, z]) => [x, y + 4 * Math.sin(x / 16), z]);

  expect(newPath.d).toBe(
    "M 0 0L 2.5 0.6224599710942241L 4.375 1.0801712668743402L 5.78125 1.4140676407503237L 6.8359375 1.6574640734447574L 10 4.840389091761849L 10 6.715389091761849L 10 8.12163909176185L 10 9.17632659176185L 7.5 11.807085885966735L 5.625 11.377460632582794L 4.21875 11.042509096222679L 3.1640625 10.78587004037591"
  );
});

test("path - total length", () => {
  const path = new PathParser("M 0 0 L 10 0 L 10 10 L 0 10");

  expect(path.length).toBe(30);

  const path2 = new PathParser(
    "M0, 0L50 50 C100 100  300 300 100 100 Z M 200, 300 L 400 500"
  );

  expect(path2.length).toBe(670.7408127300578);
});
