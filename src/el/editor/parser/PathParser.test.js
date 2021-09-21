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
});

test("path - center pointer list", () => {
    const path = new PathParser("M0,0 C20,30 50,40 100,100");
    expect(path.getCenterPointers()).toStrictEqual([
        { index: 0, pointer: [0, 0, 0]},
        { index: 1, pointer: [100, 100, 0]}
    ]);

    path.reset("M0,0 C20,30 50,40 100,100 Q 20 30 70 70");
    expect(path.getCenterPointers()).toStrictEqual([
        { index: 0, pointer: [0, 0, 0]},
        { index: 1, pointer: [100, 100, 0]},
        { index: 2, pointer: [70, 70, 0]},
    ]);    
});

test("path - same pointer list", () => {
    const path = new PathParser("M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100");    
    expect(path.getSamePointers([100, 100, 0])).toStrictEqual([
        { index: 1, pointer: [100, 100, 0]},
        { index: 3, pointer: [100, 100, 0]}
    ]);

    expect(path.getSamePointers([100, 100, 0], 70)).toStrictEqual([
        { index: 1, pointer: [100, 100, 0]},
        { index: 2, pointer: [70, 70, 0]},
        { index: 3, pointer: [100, 100, 0]}
    ]);    
})

test("path group - two path group check", () => {
    const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
        M10,10 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
    `);

    expect(path.getGroup()).toStrictEqual([
        {
            index: 0,
            groupIndex: 0,
            segments: [
                { index: 0, segment: { "command": "M", "values": [0, 0] } },
                { index: 1, segment: { "command": "C", "values": [20, 30, 50, 40, 100, 100] } },
                { index: 2, segment: { "command": "Q", "values": [20, 30, 70, 70] } },
                { index: 3, segment: { "command": "L", "values": [100, 100] } },
            ]
        },
        {
            index: 4,
            groupIndex: 1,
            segments: [
                { index: 4, segment: { "command": "M", "values": [10, 10] } },
                { index: 5, segment: { "command": "C", "values": [20, 30, 50, 40, 100, 100] } },
                { index: 6, segment: { "command": "Q", "values": [20, 30, 70, 70] } },
                { index: 7, segment: { "command": "L", "values": [100, 100] } },
            ]
        },        
    ]);
})

test("path - create group path", () => {
    const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
        M10,10 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
    `);

    expect(path.createGroupPath(0).d).toBe("M 0 0C 20 30 50 40 100 100Q 20 30 70 70L 100 100");
    expect(path.createGroupPath(1).d).toBe("M 10 10C 20 30 50 40 100 100Q 20 30 70 70L 100 100");
})

test("path - split bezier curve path by point", () => {
    const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 20 30 70 70 L 100 100
    `);

    path.splitSegmentByPoint({ x: 10, y: 10 }, 20);

    expect(path.d).toBe("M 0 0C 2.7499999999999996 4.124999999999999 5.689062499999999 7.871874999999999 8.843183593749998 11.422597656249998C 28.628125 33.6953125 56.875 48.25 100 100Q 20 30 70 70L 100 100");
})


test("path - split quard curve path by point", () => {
    const path = new PathParser(`
        M0,0 C20,30 50,40 100,100 Q 200 200 300 100
    `);

    path.splitSegmentByPoint({ x: 150, y: 150 }, 20);

    expect(path.d).toBe("M 0 0C 20 30 50 40 100 100Q 127.5 127.5 155 139.875Q 227.5 172.5 300 100");
})