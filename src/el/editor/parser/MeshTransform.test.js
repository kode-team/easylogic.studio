
import { vertiesToRectangle } from 'el/utils/collision';
import PathParser from './PathParser';
import { MeshTransform } from './MeshTransform';

test("create MeshTransform", () => {
    const path = PathParser.makeRect(0, 0, 100, 100);
    const bbox = path.getBBox();
    const rect = vertiesToRectangle(bbox, false);

    expect(new MeshTransform(rect.x, rect.y, rect.width, rect.height, 4, 4, path)).toBeInstanceOf(MeshTransform);
})

test("create MeshTransform - initialize", () => {
    const path = PathParser.makeRect(0, 0, 100, 100);
    const bbox = path.getBBox();
    const rect = vertiesToRectangle(bbox, false);

    const meshTransform = new MeshTransform(rect.x, rect.y, rect.width, rect.height, 4, 4, path);

    expect(meshTransform.points).toStrictEqual([
        { row: 0, col: 0, x: 0, y: 0 },
        { row: 0, col: 1, x: 25, y: 0 },
        { row: 0, col: 2, x: 50, y: 0 },
        { row: 0, col: 3, x: 75, y: 0 },
        { row: 0, col: 4, x: 100, y: 0 },
        { row: 1, col: 0, x: 0, y: 25 },
        { row: 1, col: 1, x: 25, y: 25 },
        { row: 1, col: 2, x: 50, y: 25 },
        { row: 1, col: 3, x: 75, y: 25 },
        { row: 1, col: 4, x: 100, y: 25 },
        { row: 2, col: 0, x: 0, y: 50 },
        { row: 2, col: 1, x: 25, y: 50 },
        { row: 2, col: 2, x: 50, y: 50 },
        { row: 2, col: 3, x: 75, y: 50 },
        { row: 2, col: 4, x: 100, y: 50 },
        { row: 3, col: 0, x: 0, y: 75 },
        { row: 3, col: 1, x: 25, y: 75 },
        { row: 3, col: 2, x: 50, y: 75 },
        { row: 3, col: 3, x: 75, y: 75 },
        { row: 3, col: 4, x: 100, y: 75 },
        { row: 4, col: 0, x: 0, y: 100 },
        { row: 4, col: 1, x: 25, y: 100 },
        { row: 4, col: 2, x: 50, y: 100 },
        { row: 4, col: 3, x: 75, y: 100 },
        { row: 4, col: 4, x: 100, y: 100 }
      ]);    
})

test("create MeshTransform - initialize  2", () => {
    const path = PathParser.makeRect(0, 0, 100, 100);
    const bbox = path.getBBox();
    const rect = vertiesToRectangle(bbox, false);

    const meshTransform = new MeshTransform(rect.x, rect.y, rect.width, rect.height, 4, 4, path);
    
    // console.log(meshTransform.vectorGroup[0]);
    expect(meshTransform.vectorGroup[0]).toStrictEqual({
        type: 'vector',
        row: 0,
        col: 0,
        p00: [ 0, 0 ],
        p01: [ 0, 1 ],
        p10: [ 1, 0 ],
        p11: [ 1, 1 ],
        top: [ [ 0, 0 ], [ 0, 1 ] ],
        left: [ [ 0, 0 ], [ 1, 0 ] ],
        right: [ [ 0, 1 ], [ 1, 1 ] ],
        bottom: [ [ 1, 0 ], [ 1, 1 ] ],
        pathVerties: [
            {
                "bottomT": 0,
                "leftT": 0,
                "rightT": 0,
                "segmentIndex": 0,
                "topT": 0,
                "valueIndex": 0,
                "x": 0,
                "y": 0,
            },
            {
                "bottomT": 0,
                "leftT": 0,
                "rightT": 0,
                "segmentIndex": 4,
                "topT": 0,
                "valueIndex": 0,
                "x": 0,
                "y": 0,
            },            
        ]
      });    
})


test("create MeshTransform - initialize  3", () => {
    const path = PathParser.makeRect(0, 0, 100, 100);
    const bbox = path.getBBox();
    const rect = vertiesToRectangle(bbox, false);

    const meshTransform = new MeshTransform(rect.x, rect.y, rect.width, rect.height, 4, 4, path);
    
    expect(meshTransform.vectorGroup[15]).toStrictEqual({
        type: 'vector',
        row: 3,
        col: 3,
        p00: [ 3, 3 ],
        p01: [ 3, 4 ],
        p10: [ 4, 3 ],
        p11: [ 4, 4 ],
        top: [ [ 3, 3 ], [ 3, 4 ] ],
        left: [ [ 3, 3 ], [ 4, 3 ] ],
        right: [ [ 3, 4 ], [ 4, 4 ] ],
        bottom: [ [ 4, 3 ], [ 4, 4 ] ],
        pathVerties: [
          {
            segmentIndex: 2,
            valueIndex: 0,
            x: 100,
            y: 100,
            topT: 1,
            leftT: 1,
            rightT: 1,
            bottomT: 1
          }
        ]
      });    
})

test("create MeshTransform - transform path", () => {
    const path = PathParser.makeRect(0, 0, 100, 100);
    const bbox = path.getBBox();
    const rect = vertiesToRectangle(bbox, false);

    const meshTransform = new MeshTransform(rect.x, rect.y, rect.width, rect.height, 1, 1, path);

    // create mesh path string
    const newPathString = meshTransform.convertPathString();

    // create path form mesh 
    const newPath2 = PathParser.fromSVGString(newPathString);

    expect(newPath2.getGroup().length).toBe(4);

    // transform mesh path 
    newPath2.transform(([x, y, z]) => {
        return [x + 0.5, y, z];
    })

    // 이걸 실제 meshTransform에 적용한다. 
    meshTransform.transformByPath(newPath2);

    // 변환된 vector map 을 가지고 최초 적용된 path 를 변환해서 마지막 시점을 복구하자. 
    // 변환된 Path 리턴 
    const releasedPath = meshTransform.release();

    expect(releasedPath.segments).toStrictEqual([
        { command: 'M', values: [ 0.5, 0 ] },
        { command: 'L', values: [ 100.5, 0 ] },
        { command: 'L', values: [ 100.5, 100 ] },
        { command: 'L', values: [ 0.5, 100 ] },
        { command: 'L', values: [ 0.5, 0 ] },
        { command: 'Z', values: [] }
    ]);

    expect(releasedPath.d).toBe(PathParser.makeRect(0.5, 0, 100, 100).d)

})