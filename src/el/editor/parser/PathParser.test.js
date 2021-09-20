import PathParser from './PathParser';

test("create PathParser", () => {
    expect(new PathParser()).toBeInstanceOf(PathParser);
})

test("create PathParser with path d", () => {
    const path = new PathParser("M0,0L1,1");
    expect(path.d).toBe("M 0 0L 1 1");
})

test("path translate", () => {
    const path = new PathParser("M0,0L1,1");
    path.translate(10, 10);
    expect(path.d).toBe("M 10 10L 11 11");
})

test("path scale", () => {
    const path = new PathParser("M0,0L1,1");
    path.scale(2, 0);
    expect(path.d).toBe("M 0 0L 2 0");
})

test("path rotate", () => {
    const path = new PathParser("M0,0L4,0");
    path.rotate(45);
    expect(path.d).toBe("M 0 0L 2.8284270763397217 2.8284270763397217");
})

test("path bbox for point", () => {
    const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
    expect(path.getBBox()).toStrictEqual([[0, 0, 0], [4, 0, 0], [4, 4, 0], [0, 4, 0]]);
})

test("path bbox for curve", () => {
    const path = new PathParser("M0,0 C 10 10, 20 20, 30 30");

    expect(path.getBBox()).toStrictEqual([[0, 0, 0], [30, 0, 0], [30, 30, 0], [0, 30, 0]]);
})

test("path reset", () => {
    const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
    path.reset("M0,0 L10,10");
    expect(path.d).toBe("M 0 0L 10 10");
})

test("path segment list", () => {
    const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
    expect(path.segments).toStrictEqual([
        { "command": "M", "values": [0, 0] },
        { "command": "L", "values": [4, 0] },
        { "command": "L", "values": [4, 4] },
        { "command": "L", "values": [0, 4] }
    ]);
})

test("path - closed point in line", () => {
    const path = new PathParser("M0,0 L4,0 L4,4 L0,4");
    expect(path.getClosedPoint({ x: 10, y: 10 }, 20)).toStrictEqual({ "x": 4, "y": 4 });
})

test("path - closed point in curve", () => {
    const path = new PathParser("M0,0 C20,30 50,40 100,100");
    expect(path.getClosedPoint({ x: 10, y: 10 }, 20)).toStrictEqual({
        "x": 8.843183593749998,
        "y": 11.422597656249998
    });
})