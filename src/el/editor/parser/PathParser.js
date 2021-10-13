
import { getBezierPointOneQuard, getBezierPoints, getBezierPointsLine, getBezierPointsQuard, getCurveBBox, recoverBezier, recoverBezierLine, recoverBezierQuard, splitBezierPointsByCount, splitBezierPointsLineByCount, splitBezierPointsQuardByCount } from "el/utils/bezier";
import { isNotUndefined, clone } from "el/sapa/functions/func";
import { degreeToRadian, round } from "el/utils/math";
import { mat4, vec3 } from "gl-matrix";
import Point from "./Point";
import { Segment } from "./Segment";
import fitCurve from "fit-curve";

const REG_PARSE_NUMBER_FOR_PATH = /([mMlLvVhHcCsSqQtTaAzZ]([^mMlLvVhHcCsSqQtTaAzZ]*))/g;
const splitReg = /[\b\t \,]/g;
var numberReg = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig
export default class PathParser {

    /**
     * 
     * @param {string} pathString  SVG Path 문자열
     */
    constructor(pathString = '') {
        this.reset(pathString);
    }

    reset(pathString = '') {
        this.segments = [];
        this.pathString = pathString.trim();

        this.parse()
    }

    /**
     * Segment 재설정 하기 
     * 
     * @param {Segment[]} segments 
     * @returns {PathParser}
     */
    resetSegments(segments) {
        this.segments = segments || []
        this.pathString = this.joinPath()

        return this;
    }

    /**
     * Segment 합치기 
     * 
     * @param {Segment[]} segments 
     * @returns {PathParser}
     */
    addSegments(segments, transform) {


        return this.resetSegments([...this.segments, ...segments])
    }

    /**
     * PathParser 합치기 
     * 
     * @param {PathParser} otherPath 
     * @returns {PathParser}
     */
    addPath (otherPath, transform = mat4.create()) {
        const newPath = otherPath.clone();
        newPath.transformMat4(transform);
        return this.addSegments(newPath.segments);
    }

    trim(str = '') {
        var arr = str.match(numberReg) || []
        return arr.filter(it => it != '');
    }

    /**
     * convert svg path string to segments 
     * 
     * @private
     * 
     */
    parse() {
        var arr = this.pathString.match(REG_PARSE_NUMBER_FOR_PATH) || [];

        this.segments = arr.map(s => {
            var command = s[0]
            var values = this.trim(s.replace(command, '')).map(it => +it);

            return { command, values }
        });

        // 상대 좌표를 모두 절 대 좌표로 변경 
        // 절대좌표로 변환이 되어야 transform 을 쉽게 적용 할 수 있다. 
        // 물론 트랜스폼 하기 전에 절대 좌표로 구조를 맞추고 
        // 다시 돌아올 수도 있겠지만 불필요한 작업이 너무 많아질 수도 있다. 
        this.segments = this.segments.map((s, index) => {
            switch (s.command) {
                case 'm':
                    var prev = this.segments[index - 1]

                    if (prev && (prev.command == 'z' || prev.command == 'Z')) {
                        prev = this.segments[index - 2]
                    }
                    var x = prev?.values[prev.values.length - 2] || 0
                    var y = prev?.values[prev.values.length - 1] || 0

                    for (var i = 0, len = s.values.length; i < len; i += 2) {
                        s.values[i] += x
                        s.values[i + 1] += y
                    }

                    return {
                        command: s.command.toUpperCase(),
                        values: [...s.values]
                    };
                case 'c':
                case 'l':
                case 'q':
                case 's':
                case 't':
                case 'v':
                case 'h':
                    var prev = this.segments[index - 1]
                    var x = prev?.values[prev.values.length - 2] || 0
                    var y = prev?.values[prev.values.length - 1] || 0

                    for (var i = 0, len = s.values.length; i < len; i += 2) {
                        s.values[i] += x
                        s.values[i + 1] += y
                    }

                    return {
                        command: s.command.toUpperCase(),
                        values: [...s.values]
                    };
                case 'z':
                    return {
                        command: s.command.toUpperCase(),
                        values: []
                    }
                default:
                    return s;
            }
        })
    }

    convertGenerator() {

        var points = []

        for (var index = 0, len = this.segments.length; index < len; index++) {
            var s = this.segments[index]
            var nextSegment = this.segments[index + 1]
            const { command, values } = s;

            if (command === 'M') {
                var [x, y] = values
                points.push({
                    command,
                    originalCommand: command,
                    startPoint: { x, y },
                    endPoint: { x, y },
                    reversePoint: { x, y },
                    curve: false
                })
            } else if (command === 'L') {
                var prevPoint = Point.getPrevPoint(points, points.length);

                if (prevPoint.curve) {
                    var [x, y] = values
                    points.push({
                        command,
                        originalCommand: command,
                        startPoint: { x, y },
                        endPoint: { x, y },
                        reversePoint: clone(prevPoint.endPoint),
                        curve: true
                    })
                } else {

                    var [x, y] = values
                    points.push({
                        command,
                        originalCommand: command,
                        startPoint: { x, y },
                        endPoint: { x, y },
                        reversePoint: { x, y },
                        curve: false
                    })
                }

            } else if (command === 'Q') {
                var [cx1, cy1, x, y] = values;
                var prevPoint = Point.getPrevPoint(points, points.length);

                if (prevPoint.curve) {  // 내가 Q 인데 앞의 포인트가  
                    var startPoint = { x, y }
                    var endPoint = { x, y }
                    var reversePoint = { x, y }
                    points.push({
                        command: 'L',
                        originalCommand: command,
                        startPoint,
                        endPoint,
                        reversePoint,
                        curve: false
                    })

                    prevPoint.endPoint = { x: cx1, y: cy1 }

                } else {


                    if (nextSegment && nextSegment.command === 'L') {
                        prevPoint.curve = true;
                        prevPoint.endPoint = { x: cx1, y: cy1 }

                        var startPoint = { x, y }
                        var reversePoint = { x, y }
                        var endPoint = { x, y }

                        points.push({
                            command: 'L',
                            originalCommand: command,
                            curve: false,
                            startPoint,
                            endPoint,
                            reversePoint
                        })

                    } else {

                        var startPoint = { x, y }
                        var reversePoint = { x: cx1, y: cy1 }
                        var endPoint = { x, y }

                        points.push({
                            command,
                            originalCommand: command,
                            curve: true,
                            startPoint,
                            endPoint,
                            reversePoint
                        })
                    }


                }
            } else if (command === 'T') {
                var [x, y] = values;
                // T 는 앞에 Q 가 있다는 소리 
                // Q 의 Control Point 반대편에 Control Point 가 있다고 치고 생각하자. 
                var prevSegment = segments[index - 1]

                if (prevSegment && prevSegment.command === 'Q') {
                    var [cx1, cy1, sx, sy] = prevSegment.values

                    var prevPoint = Point.getPrevPoint(points, points.length)
                    prevPoint.endPoint = Point.getReversePoint({ x: sx, y: sy }, { x: cx1, y: cy1 });

                    var startPoint = { x, y }
                    var endPoint = { x, y }
                    var reversePoint = { x, y }
                    points.push({
                        command: 'L',
                        originalCommand: command,
                        startPoint,
                        endPoint,
                        reversePoint,
                        curve: false
                    })
                }


            } else if (command === 'C') {

                var prevPoint = Point.getPrevPoint(points, points.length)

                var [cx1, cy1, cx2, cy2, x, y] = values;
                var startPoint = { x, y }
                var reversePoint = { x: cx2, y: cy2 }
                var endPoint = { x, y }

                points.push({
                    command,
                    originalCommand: command,
                    curve: true,
                    startPoint,
                    endPoint,
                    reversePoint
                })

                if (prevPoint) {
                    prevPoint.curve = true;
                    prevPoint.endPoint = { x: cx1, y: cy1 }
                }
            } else if (command === 'S') {
                var [x, y] = values;
                // S 는 앞에 C,S 가 있다는 소리 
                // S 의 Control Point 반대편에 Control Point 가 있다고 치고 생각하자. 
                var prevSegment = segments[index - 1]

                if (prevSegment && prevSegment.command === 'C') {
                    var [cx2, cy2, sx, sy] = prevSegment.values

                    var prevPoint = Point.getPrevPoint(points, points.length)
                    prevPoint.endPoint = Point.getReversePoint(prevPoint.startPoint, prevPoint.reversePoint);

                    var startPoint = { x, y }
                    var endPoint = { x, y }
                    var reversePoint = { x: cx2, y: cy2 }
                    points.push({
                        command: 'Q',
                        originalCommand: command,
                        startPoint,
                        endPoint,
                        reversePoint,
                        curve: false
                    })
                }


            } else if (command === 'Z') {
                var prevPoint = Point.getPrevPoint(points, points.length);
                var firstPoint = Point.getFirstPoint(points, points.length);

                if (Point.isEqual(prevPoint.startPoint, firstPoint.startPoint)) {
                    prevPoint.connected = true;

                    prevPoint.endPoint = clone(firstPoint.endPoint)
                    firstPoint.reversePoint = clone(prevPoint.reversePoint)
                }

                prevPoint.close = true;

            }
        }

        points = points.filter(p => !!p);

        return points;
    }

    length() {
        return this.segments.length;
    }

    setSegments(index, seg) {
        this.segments[index] = seg;
    }

    getSegments(index) {
        if (isNotUndefined(index)) {
            return this.segments[index];
        }
        return this.segments;
    }

    /**
     * 편집하는 poinsts 에 대한 실제 SVG Path 를 출력한다. 
     * 
     * @param {array} [segments=this.segments] 
     * @param {string} [split=""] 
     * @returns 
     */
    joinPath(segments, split = '') {
        var list = (segments || this.segments);
        return list.map(it => {
            return `${it.command} ${it.values.length ? it.values.join(' ') : ''}`
        }).join(split)
    }

    each(callback, isReturn = false) {
        var newSegments = this.segments.map((segment, index) => {
            return callback.call(this, segment, index);
        })

        if (isReturn) {
            return newSegments;
        } else {
            this.segments = newSegments;
        }

        return this;
    }

    _loop(m, isReturn = false) {
        return this.each(function (segment) {
            var v = segment.values;
            var c = segment.command;

            switch (c) {
                case 'M':
                case 'L':
                    var result = m(v, 0);
                    segment.values = [result[0], result[1]];
                    break;
                case 'V':
                    var result = m([+v[0], 0]);
                    segment.values = [result[0]];
                    break;
                case 'H':
                    var result = m([0, +v[0]]);
                    segment.values = [result[1]];
                    break;
                case 'C':
                case 'S':
                case 'T':
                case 'Q':
                    for (var i = 0, len = v.length; i < len; i += 2) {
                        var result = m(v, i);
                        segment.values[i] = result[0];
                        segment.values[i + 1] = result[1];
                    }
                    break;
                case 'A':

                    break;
            }

            return segment;

        }, isReturn);
    }

    clone() {
        const path = new PathParser();

        path.resetSegments(this.segments.map(it => {
            return {
                command: it.command,
                values: it.values.slice()
            }
        }));

        return path;
    }

    translate(tx, ty) {
        this.transformMat4(mat4.fromTranslation([], [tx, ty, 0]));
        return this;
    }

    translateTo(tx, ty) {
        return this.joinPath(this.transformMat4(mat4.fromTranslation([], [tx, ty, 0]), true));
    }

    scale(sx, sy) {
        this.transformMat4(mat4.fromScaling([], [sx, sy, 1]));
        return this;
    }

    scaleTo(sx, sy) {
        return this.joinPath(this.transformMat4(mat4.fromScaling([], [sx, sy, 1]), true));
    }

    rotate(angle, centerX = 0, centerY = 0) {
        const view = mat4.create();
        mat4.multiply(view, view, mat4.fromTranslation([], [centerX, centerY, 0]))
        mat4.multiply(view, view, mat4.fromZRotation([], degreeToRadian(angle)))
        mat4.multiply(view, view, mat4.fromTranslation([], vec3.negate([], [centerX, centerY, 0])))

        this.transformMat4(view);
        return this;
    }

    rotateTo(angle, centerX = 0, centerY = 0) {

        const view = mat4.create();
        mat4.multiply(view, view, mat4.fromTranslation([], [centerX, centerY, 0]))
        mat4.multiply(view, view, mat4.fromZRotation([], degreeToRadian(angle)))
        mat4.multiply(view, view, mat4.fromTranslation([], vec3.negate([], [centerX, centerY, 0])))

        return this.joinPath(this.transformMat4(view, true))
    }

    reflectionOrigin() {
        this.transformMat4(mat4.fromScaling([], [-1, -1, 0]))
        return this;
    }

    reflectionOriginTo() {
        return this.joinPath(
            this.transformMat4(
                mat4.fromScaling([], [-1, -1, 0]),
                true
            )
        )
    }

    flipX() {
        this.transformMat4(mat4.fromScaling([], [1, -1, 0]))
        return this;
    }

    flipXTo() {
        return this.joinPath(
            this.transformMat4(
                mat4.fromScaling([], [1, -1, 0]),
                true
            )
        )
    }

    flipY() {
        this.transformMat4(mat4.fromScaling([], [-1, 1, 0]))
        return this;
    }

    flipYTo() {
        return this.joinPath(
            this.transformMat4(
                mat4.fromScaling([], [-1, 1, 0]),
                true
            )
        )
    }


    skewX(angle) {
        this.transformMat4(
            mat4.fromValues(
                1, Math.tan(degreeToRadian(angle)), 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            )
        )
        return this;
    }


    skewXTo(angle) {
        return this.joinPath(
            this.transformMat4(
                mat4.fromValues(
                    1, Math.tan(degreeToRadian(angle)), 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ),
                true
            )
        )
    }

    skewY(angle) {
        this.transformMat4(
            mat4.fromValues(
                1, 0, 0, 0,
                Math.tan(degreeToRadian(angle)), 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            )
        )
        return this;
    }

    skewYTo(angle) {
        return this.joinPath(
            this.transformMat4(
                mat4.fromValues(
                    1, 0, 0, 0,
                    Math.tan(degreeToRadian(angle)), 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ),
                true
            )
        )
    }

    /**
     * 내부 path 를 모두 curve 로 변환한다. 
     */
    normalize() {

        const allSegments = []

        const groupList = this.getGroup();

        groupList.forEach(group => {

            const newSegments = [];

            group.segments.forEach(({ segment }, index) => {
                const prevSegment = group.segments[index - 1]?.segment;

                if (segment.command === 'M') {
                    newSegments.push(segment);
                    return;
                } else if (segment.command === 'L') {
                    newSegments.push({
                        command: 'C',
                        values: [
                            prevSegment.values[0] + (segment.values[0] - prevSegment.values[0]) * 0.33,
                            prevSegment.values[1] + (segment.values[1] - prevSegment.values[1]) * 0.33,
                            prevSegment.values[0] + (segment.values[0] - prevSegment.values[0]) * 0.66,
                            prevSegment.values[1] + (segment.values[1] - prevSegment.values[1]) * 0.66,
                            segment.values[0],
                            segment.values[1]
                        ]
                    });
                    return;
                } else if (segment.command === 'C') {
                    newSegments.push(segment);
                } else if (segment.command === 'Q') {
                    const twoOfThree = 2 / 3;

                    newSegments.push({
                        command: 'C',
                        values: [
                            // C1 = Q0 + (2/3) (Q1 - Q0)
                            prevSegment.values[0] + twoOfThree * (segment.values[0] - prevSegment.values[0]),
                            prevSegment.values[1] + twoOfThree * (segment.values[1] - prevSegment.values[1]),

                            // C2 = Q2 + (2/3) (Q1 - Q2)
                            segment.values[2] + twoOfThree * (segment.values[0] - segment.values[2]),
                            segment.values[3] + twoOfThree * (segment.values[1] - segment.values[3]),

                            // C3 = Q2
                            segment.values[2],
                            segment.values[3]
                        ]
                    });
                } else if (segment.command === 'Z') {
                    newSegments.push(segment);
                }
            })

            allSegments.push(...newSegments);
        })

        const normalizedPath = new PathParser();
        normalizedPath.resetSegments(allSegments);

        return normalizedPath;
    }

    /**
     * count 에 의해 각각의 segment 를 나눈다. 
     * 
     * @param {number} count 
     * @returns 
     */
    divideSegmentByCount(count = 1) {
        let allSegments = [];
        const groupList = this.getGroup();

        groupList.forEach(group => {
            const newSegments = [];
            group.segments.forEach(({ segment }, index) => {
                const prevSegment = group.segments[index - 1]?.segment;
                const nextSegment = group.segments[index + 1]?.segment;

                if (segment.command === 'M') {
                    newSegments.push(segment);
                    return;
                } else if (segment.command === 'L') {

                    const linePoints = splitBezierPointsLineByCount([
                        {
                            x: prevSegment.values[prevSegment.values.length - 2],
                            y: prevSegment.values[prevSegment.values.length - 1]
                        },
                        {
                            x: segment.values[0],
                            y: segment.values[1]
                        }
                    ], count)

                    linePoints.forEach(([start, end]) => {
                        newSegments.push(Segment.L(end.x, end.y));
                    })
                } else if (segment.command === 'Q') {

                    const quardPoints = splitBezierPointsQuardByCount([
                        {
                            x: prevSegment.values[prevSegment.values.length - 2],
                            y: prevSegment.values[prevSegment.values.length - 1]
                        },
                        {
                            x: segment.values[0],
                            y: segment.values[1]
                        },
                        {
                            x: segment.values[2],
                            y: segment.values[3]
                        }
                    ], count)

                    quardPoints.forEach(([start, middle, end]) => {
                        newSegments.push(Segment.Q(middle.x, middle.y, end.x, end.y));
                    })
                } else if (segment.command === 'C') {

                    const curvePoints = splitBezierPointsByCount([
                        {
                            x: prevSegment.values[prevSegment.values.length - 2],
                            y: prevSegment.values[prevSegment.values.length - 1]
                        },
                        {
                            x: segment.values[0],
                            y: segment.values[1]
                        },
                        {
                            x: segment.values[2],
                            y: segment.values[3]
                        },
                        {
                            x: segment.values[4],
                            y: segment.values[5]
                        }
                    ], count)

                    curvePoints.forEach(([start, c1, c2, end]) => {
                        newSegments.push(Segment.C(c1.x, c1.y, c2.x, c2.y, end.x, end.y));
                    })
                } else if (segment.command === 'Z') {
                    newSegments.push(segment);
                }
            })

            allSegments = allSegments.concat(newSegments);
        })

        return PathParser.fromSegments(allSegments);
    }

    getBBox() {

        let minX = Number.MAX_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER, maxY = Number.MIN_SAFE_INTEGER;

        this.each(function (segment, index) {
            var v = segment.values;
            var c = segment.command;
            const prevSegment = this.segments[index - 1];
            const accurancy = 1 / 10000;

            switch (c) {
                case 'M':
                case 'L':

                    minX = Math.min(minX, v[0])
                    maxX = Math.max(maxX, v[0])

                    minY = Math.min(minY, v[1])
                    maxY = Math.max(maxY, v[1])
                    break;
                case 'V':
                    minX = Math.min(minX, v[0])
                    maxX = Math.max(maxX, v[0])
                    break;
                case 'H':
                    minY = Math.min(minY, v[1])
                    maxY = Math.max(maxY, v[1])
                    break;
                case 'C':
                    getCurveBBox([
                        [prevSegment.values[prevSegment.values.length - 2], prevSegment.values[prevSegment.values.length - 1], 0],
                        [v[0], v[1], 0],
                        [v[2], v[3], 0],
                        [v[4], v[5], 0],
                    ]).forEach(p => {
                        minX = Math.min(minX, p[0])
                        maxX = Math.max(maxX, p[0])

                        minY = Math.min(minY, p[1])
                        maxY = Math.max(maxY, p[1])
                    })
                    break;
                case 'Q':
                    // TODO: 정상적으로 동작하지 않는 듯 하다. 
                    const newPoints = [
                        [prevSegment.values[prevSegment.values.length - 2], prevSegment.values[prevSegment.values.length - 1], 0],
                        [v[0], v[1], 0],
                        [v[2], v[3], 0],
                    ].map(p => {
                        return { x: p[0], y: p[1] }
                    })
                    for (var i = 0; i <= 1; i += accurancy) {
                        const { x, y } = getBezierPointOneQuard(newPoints, i);

                        minX = Math.min(minX, x)
                        maxX = Math.max(maxX, x)

                        minY = Math.min(minY, y)
                        maxY = Math.max(maxY, y)
                    }
                    break;
                case 'A':

                    break;
            }

            return segment;
        });

        return [
            [minX, minY, 0],
            [maxX, minY, 0],
            [maxX, maxY, 0],
            [minX, maxY, 0],
        ]
    }

    rect() {
        const bbox = this.getBBox();

        return {
            x: bbox[0][0],
            y: bbox[0][1],
            width: vec3.distance(bbox[0], bbox[1]),
            height: vec3.distance(bbox[0], bbox[3]),
            right: bbox[0][0] + vec3.distance(bbox[0], bbox[1]),
            bottom: bbox[0][1] + vec3.distance(bbox[0], bbox[3]),
        }
    }

    /**
     * x, y 를 기준으로 가장 가까운 점을 찾는다. 
     * 
     * L, C, Q 를 대상으로만 한다. 
     * 
     * @param {{x: number, y: number}} param0 
     * @param {number} count 
     * @returns 
     */
    getClosedPointInfo({ x, y }, count = 20) {

        let minDist = Number.MAX_SAFE_INTEGER;
        let targetInfo = {};
        let info = {}

        for (var i = 1, len = this.segments.length; i < len; i++) {

            const segment = this.segments[i];

            const prev = this.segments[i - 1].values
            const current = segment.values
            const command = segment.command;
            const lastPoint = { x: prev[prev.length - 2], y: prev[prev.length - 1] }


            if (command === 'C') {
                var points = [
                    lastPoint,
                    { x: current[0], y: current[1] },
                    { x: current[2], y: current[3] },
                    { x: current[4], y: current[5] },
                ]

                var curve = recoverBezier(...points, count)
                var t = curve(x, y);

                info = {
                    segment,
                    index: i,
                    t,
                    points,
                    targetPoint: getBezierPoints(points, t).first[3]
                }
            } else if (command === 'Q') {
                var points = [
                    lastPoint,
                    { x: current[0], y: current[1] },
                    { x: current[2], y: current[3] },
                ]

                var curve = recoverBezierQuard(...points, count)
                var t = curve(x, y);

                info = {
                    segment,
                    index: i,
                    t,
                    points,
                    targetPoint: getBezierPointsQuard(points, t).first[2]
                }
            } else if (command === 'L') {
                var points = [
                    lastPoint,
                    { x: current[0], y: current[1] },
                ]

                var curve = recoverBezierLine(...points, count)
                var t = curve(x, y);

                info = {
                    segment,
                    index: i,
                    t,
                    points,
                    targetPoint: getBezierPointsLine(points, t).first[1]
                }
            }

            if (info) {
                var dist = Math.sqrt(Math.pow(info.targetPoint.x - x, 2) + Math.pow(info.targetPoint.y - y, 2))

                if (dist < minDist) {
                    minDist = dist;
                    targetInfo = info;
                }
            }

        }

        return targetInfo
    }


    /**
     * x, y 를 기준으로 가장 가까운 점을 찾는다. 
     * 
     * L, C, Q 를 대상으로만 한다. 
     * 
     * @param {{x: number, y: number}} param0 
     * @param {number} count 
     * @returns 
     */
    getClosedPoint({ x, y }, count = 20) {

        const info = this.getClosedPointInfo({ x, y }, count);

        if (info.targetPoint) {
            return info.targetPoint;
        }

        return { x, y };
    }

    /**
     * 
     * x, y 가 path 위에 있는 point 인지 확인함. 
     * 
     * @param {{x: number, y: number}} param0 
     * @param {number} dist 
     * @returns 
     */
    isPointInPath({ x, y }, dist = 1) {
        const info = this.getClosedPointInfo({ x, y }, 20);

        if (info.targetPoint) {
            if (vec3.dist([info.targetPoint.x, info.targetPoint.y, 0], [x, y, 0]) <= dist) {
                return true;
            }
        }

        return false;
    }

    get d() {
        return this.toString().trim();
    }

    get closed () {
        return this.segments.some(segment => segment.command === 'Z');
    }

    toString(split = '') {
        return this.joinPath(undefined, split);
    }

    transformMat4(transformMatrix, isReturn = false) {
        return this.each(function (segment) {
            var v = segment.values;
            var c = segment.command;

            switch (c) {
                case 'M':
                case 'L':
                    var result = vec3.transformMat4([], [v[0], v[1], 0], transformMatrix);
                    segment.values = [result[0], result[1]]
                    break;
                case 'C':
                case 'Q':
                    for (var i = 0, len = v.length; i < len; i += 2) {
                        var result = vec3.transformMat4([], [v[i], v[i + 1], 0], transformMatrix)
                        segment.values[i] = result[0];
                        segment.values[i + 1] = result[1];
                    }
                    break;
                case 'A':

                    break;
            }

            return segment;

        }, isReturn);
    }

    transform (customTransformFunction = ([x, y, z]) => ([x, y, z])) {
        return this.each(function (segment) {
            var v = segment.values;
            var c = segment.command;

            switch (c) {
                case 'M':
                case 'L':
                    var result = customTransformFunction([v[0], v[1], 0]);
                    segment.values = [result[0], result[1]]
                    break;
                case 'C':
                case 'Q':
                    for (var i = 0, len = v.length; i < len; i += 2) {
                        var result = customTransformFunction([v[i], v[i + 1], 0]);
                        segment.values[i] = result[0];
                        segment.values[i + 1] = result[1];
                    }
                    break;
                case 'A':

                    break;
            }

            return segment;

        });
    }

    /**
     * 좌표 역변환 
     * 
     * @param {mat4} transformMatrix 
     * @returns 
     */
    invert(transformMatrix) {
        this.transformMat4(mat4.invert([], transformMatrix));
        return this;
    }

    /**
     * 좌표 숫자를 rounding 한다. 
     * 
     * @param {number} [k=1] round number 계수  
     * @returns 
     */
    round(k = 1) {
        this.each(function (segment) {
            segment.values = segment.values.map(it => round(it, k));

            return segment;
        });

        return this;
    }

    reverseSegments(segments) {
        const newSegments = [];
        let lastIndex = segments.length - 1;
        for (var i = lastIndex; i > 0; i--) {
            const segment = segments[i];
            const v = segment.values;
            const c = segment.command;
            const prevSegment = segments[i - 1];
            const lastX = prevSegment.values[prevSegment.values.length - 2];
            const lastY = prevSegment.values[prevSegment.values.length - 1];

            switch (c) {
                case 'L':

                    if (i === lastIndex) {        // last 일 경우 
                        newSegments.push(Segment.M(v[0], v[1]));
                    }

                    newSegments.push(Segment.L(lastX, lastY))
                    break;
                case 'C':

                    if (i === lastIndex) {        // last 일 경우 
                        newSegments.push(Segment.M(v[4], v[5]))
                    }

                    newSegments.push(Segment.C(v[2], v[3], v[0], v[1], lastX, lastY))
                    break;
                case 'Q':
                    if (i === lastIndex) {        // last 일 경우 
                        newSegments.push(Segment.M(v[2], v[3]))
                    }

                    newSegments.push(Segment.Q(v[0], v[1], lastX, lastY))
                    break;
                case 'Z':
                    newSegments.push(segment);
                    lastIndex = i - 1;
                    break;
            }
        }

        // z가 가장 먼저 올 때는 z 를 다시 뒤로 돌려보낸다. 
        if (newSegments[0].command === 'Z') {
            newSegments.push(newSegments.shift());
        }

        return newSegments;
    }

    /**
     * segments 를 M 기준으로 분리 시킨다. 
     */
    splitSegments() {

        const groupSegments = []
        let newSegments = []
        this.segments.forEach(s => {
            if (s.command === 'M') {
                newSegments = [s]
                groupSegments.push(newSegments);
            } else {
                newSegments.push(s);
            }
        })

        return groupSegments;
    }

    /**
     * path 의 segment 들을 역순으로 정렬한다. 
     * 
     * M이 여러개일 경우는  group 별로 역순으로 정렬하고 합친다. 
     * 
     * groupIndex 가 0이상 일때는 해당 group만 역순으로 정렬한다. 
     * 
     * @param {number} groupIndex 
     * @returns {PathParser}
     */
    reverse(...groupIndexList) {
        const groupSegments = this.splitSegments();
        const newSegments = []

        if (groupIndexList.length === 0) {
            groupSegments.forEach((segments, index) => {
                newSegments.push.apply(newSegments, this.reverseSegments(segments));
            })
        } else {
            groupSegments.forEach((segments, index) => {
                if (groupIndexList.includes(index)) {
                    newSegments.push.apply(newSegments, this.reverseSegments(segments));
                } else {
                    newSegments.push.apply(newSegments, segments);
                }
            })
        }

        this.resetSegments(newSegments);
    }

    get verties() {
        let arr = []

        let lastValues = []
        this.each(function (segment) {
            var v = segment.values;
            var c = segment.command;

            switch (c) {
                case 'M':
                case 'L':
                    arr.push([...segment.values, 0])
                    break;
                case 'V':
                    arr.push([v[0], lastValues.pop(), 0])
                    break;
                case 'H':
                    lastValues.pop()
                    arr.push([lastValues.pop(), v[0], 0])
                    break;
                case 'C':
                case 'S':
                case 'T':
                case 'Q':
                    for (var i = 0, len = v.length; i < len; i += 2) {
                        arr.push([v[i], v[i + 1], 0]);
                    }
                    break;
                case 'A':

                    break;
            }

            lastValues = v;

        });

        return arr;
    }

    /**
     * 컨트롤 포인트를 제외한 모든 점을 반환한다.
     * 
     * @returns {{index: number, pointer: vec3}[]}
     */
    getCenterPointers() {
        let arr = []

        let lastValues = []
        this.segments.forEach((segment, index) => {
            var v = segment.values;
            var c = segment.command;

            switch (c) {
                case 'M':
                case 'L':
                    arr.push({
                        index,
                        pointer: [...segment.values, 0]
                    })
                    break;
                case 'V':
                    arr.push({
                        index,
                        pointer: [v[0], lastValues.pop(), 0]
                    })
                    break;
                case 'H':
                    lastValues.pop()
                    arr.push({
                        index,
                        pointer: [lastValues.pop(), v[0], 0]
                    })
                    break;
                case 'C':
                case 'S':
                case 'T':
                case 'Q':
                    arr.push({
                        index,
                        pointer: [v[v.length - 2], v[v.length - 1], 0]
                    });
                    break;
                case 'A':

                    break;
            }

            lastValues = clone(v);

        });

        return arr;

    }

    /**
     * 주어진 포인트와 같은 포인트 리스트를 검색한다. 
     * 
     * @param {vec3} pointer 
     * @param {number} [dist=0]
     * @returns 
     */
    getSamePointers(pointer, dist = 0) {
        return this.getCenterPointers().filter(p => {
            if (vec3.distance(p.pointer, pointer) <= dist) {
                return true;
            }
        });
    }

    /**
     * @typedef Segment
     * @type {object}
     * @property {string} command
     * @property {number[]} values
     */

    /**
     * @typedef SegmentGroup
     * @type {object}
     * @property {number} index 
     * @property {number} groupIndex 
     * @property {Segment[]} segments
     */

    /**
     * segments 를 M 기준으로 분리 시킨다. 
     * 
     * @returns {SegmentGroup[]}
     */
    getGroup() {

        /**
         * @type {SegmentGroup[]}
         */
        const groupSegments = []
        let newSegments = []
        this.segments.forEach((segment, index) => {
            if (segment.command === 'M') {
                newSegments = [{
                    index,
                    segment
                }]
                groupSegments.push({ index, groupIndex: groupSegments.length, segments: newSegments });
            } else {
                newSegments.push({
                    index,
                    segment
                });
            }
        })

        return groupSegments;
    }

    /**
     * groupPath 생성 
     * 
     * @param {number} index  group index
     * @returns 
     */
    createGroupPath(index) {
        const path = new PathParser();
        path.resetSegments(this.getGroup()[index]?.segments?.map(it => {
            return it.segment;
        }) || []);

        return path;
    }


    /**
     * index 에 있는 segment 를 삭제하고 segments 로 다시 설정한다.
     * 
     * @param {number} index 
     * @param  {object[]} segments 
     */
    replaceSegment(index, ...segments) {
        const newSegments = [...this.segments];
        newSegments.splice(index, 1, ...segments)

        this.resetSegments(newSegments);
    }

    /**
     * 특정 포인트로 segment 분리하기 
     * 
     * @param {{x: number, y: number}} pos 
     * @param {number} [dist=0]
     * @returns 
     */
    splitSegmentByPoint(pos, dist = 0) {
        const closedPointInfo = this.getClosedPointInfo(pos, dist);

        if (closedPointInfo && closedPointInfo.t > 0 && closedPointInfo.t < 1) {
            switch (closedPointInfo.segment.command) {
                case "C":
                    var list = getBezierPoints(closedPointInfo.points, closedPointInfo.t);

                    var first = list.first;
                    var firstSegment = Segment.C(first[1].x, first[1].y, first[2].x, first[2].y, first[3].x, first[3].y)

                    var second = list.second;
                    var secondSegment = Segment.C(second[1].x, second[1].y, second[2].x, second[2].y, second[3].x, second[3].y)

                    this.replaceSegment(closedPointInfo.index, firstSegment, secondSegment);
                    break;
                case "Q":
                    var list = getBezierPointsQuard(closedPointInfo.points, closedPointInfo.t);

                    var first = list.first;
                    var firstSegment = Segment.Q(first[1].x, first[1].y, first[2].x, first[2].y)
                    var second = list.second;
                    var secondSegment = Segment.Q(second[1].x, second[1].y, second[2].x, second[2].y)

                    this.replaceSegment(closedPointInfo.index, firstSegment, secondSegment);
                    break;
                case "L":
                    var list = getBezierPointsLine(closedPointInfo.points, closedPointInfo.t);

                    var first = list.first;
                    var firstSegment = Segment.L(first[1].x, first[1].y)
                    var second = list.second;
                    var secondSegment = Segment.L(second[1].x, second[1].y)

                    this.replaceSegment(closedPointInfo.index, firstSegment, secondSegment);
                    break;
                default:
                    return;
            }

            return closedPointInfo;
        }


    }

    /**
     * convert to multi segment path list 
     */
    toMultiSegmentPathList() {
        const paths = []

        const group = this.getGroup();
        group.forEach((group, index) => {
            group.segments.forEach((s, index) => {
                const prevSegment = group.segments[index - 1];
                const lastValues = prevSegment?.segment?.values || [];
                const lastX = lastValues[lastValues.length - 2];
                const lastY = lastValues[lastValues.length - 1];
                const values = s.segment.values;

                if (s.segment.command === 'M') {
                    // NOOP
                } else if (s.segment.command === 'L') {
                    paths.push(new PathParser(`M ${lastX} ${lastY}L ${values.join(' ')}`));
                } else if (s.segment.command === 'C') {
                    paths.push(new PathParser(`M ${lastX} ${lastY}C ${values.join(' ')}`));
                } else if (s.segment.command === 'Q') {
                    paths.push(new PathParser(`M ${lastX} ${lastY}Q ${values.join(' ')}`));
                } else {
                    // NOOP 
                }
            })
        });

        return paths;
    }


    /**
     * points 를 간소화 한다.
     * 
     * ps.
     * 
     * pathkit 에 있는 simplify 는 group 화 되어 있는 path 를 합쳐주는거라서 이 알고리즘이랑 다름. 
     * 
     * @param {number} tolerance 
     * @returns 
     */
    simplify(tolerance = 0.1) {
        const newGroupSegments = [];
        const groupList = this.getGroup();
        groupList.forEach((group, groupIndex) => {
            const points = [
                ...group.segments
                    .filter(it => it.segment.command.toLowerCase() !== 'z')
                    .map(it => {
                        return {
                            x: it.segment.values[0],
                            y: it.segment.values[1]
                        };
                    })
            ];

            const newPoints = Point.simply(points, tolerance);

            const newSegments = [];
            newPoints.forEach((p, index) => {

                if (index === 0) {
                    newSegments.push(Segment.M(p.x, p.y));
                } else {
                    newSegments.push(Segment.L(p.x, p.y));
                }
            })

            newGroupSegments.push(...newSegments);
        })

        return PathParser.fromSegments(newGroupSegments);
    }

    /**
     * 
     * convert points to curve 
     * 
     * @param {number} error count
     * @returns 
     */
    smooth(error = 50) {
        let newGroupSegments = [];
        const groupList = this.getGroup();
        groupList.forEach((group, groupIndex) => {
            const points = [
                ...group.segments
                    .filter(it => it.segment.command.toLowerCase() !== 'z')
                    .map(it => {
                        return [...it.segment.values, 0];
                    })
            ];

            const bezierCurve = fitCurve(points, error);
            const newSegments = [];
            bezierCurve.forEach((curve, index) => {

                if (index === 0) {
                    newSegments.push(Segment.M(...curve[0]));
                }

                newSegments.push(Segment.C(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1]));

            })

            if (group.segments[group.segments.length - 1].segment.command.toLowerCase() === 'z') {
                newSegments.push(Segment.Z());
            }

            newGroupSegments = newGroupSegments.concat(newSegments);
        })

        return PathParser.fromSegments(newGroupSegments);
    }

    /**
     * convert points to Cardinal Splines
     * 
     * Vn = (1 - tension) (Pn+1 - Pn-1) /2
     * 
     * @param {number} tension 
     * @returns {PathParser}
     */
    cardinalSplines(tension = 0.5) {
        const newGroupSegments = [];
        const groupList = this.getGroup();
        groupList.forEach((group, groupIndex) => {

            const points = [
                ...group.segments
                    .filter(it => it.segment.command.toLowerCase() !== 'z')
                    .map(it => {
                        return [...it.segment.values, 0];
                    })
            ];

            const newPoints = [];

            points.forEach((point, index) => {
                const prevPoint = points[index - 1];
                const nextPoint = points[index + 1];

                if (index === 0) {          // 처음과 끝은 제외
                    newPoints.push({ point });
                } else if (index === points.length - 1) {   // 처음과 끝은 제외

                    const firstPoint = points[0];

                    if (vec3.equals(firstPoint, point)) {
                        const p0 = prevPoint;
                        const p1 = point;
                        const p2 = points[1];

                        // (Pn+1 - Pn-1) /2
                        // Vn = (1 - tension) (Pn+1 - Pn-1) /2                    
                        const V1 = vec3.div([], vec3.subtract([], p2, p0), [2, 2, 1]);
                        const V3 = vec3.multiply([], V1, [1 - tension, 1 - tension, 1]);
                        const V2 = vec3.negate([], V3);

                        newPoints.push({ reversePoint: vec3.add([], p1, V2), point: p1, endPoint: vec3.add([], p1, V3) })
                    } else {
                        newPoints.push({ point });
                    }


                } else {
                    const p0 = prevPoint;
                    const p1 = point;
                    const p2 = nextPoint;

                    // (Pn+1 - Pn-1) /2
                    // Vn = (1 - tension) (Pn+1 - Pn-1) /2                    
                    const V1 = vec3.div([], vec3.subtract([], p2, p0), [2, 2, 1]);
                    const V3 = vec3.multiply([], V1, [1 - tension, 1 - tension, 1]);
                    const V2 = vec3.negate([], V3);

                    newPoints.push({ reversePoint: vec3.add([], p1, V2), point: p1, endPoint: vec3.add([], p1, V3) })
                }

            })

            const newSegments = [];

            newPoints.forEach((p, index) => {
                if (index === 0) {
                    newSegments.push(Segment.M(p.point[0], p.point[1]));
                } else {
                    const prevPoint = newPoints[index - 1] || newPoints[newPoints.length - 1];
                    const nextPoint = newPoints[index + 1];

                    if (!prevPoint.endPoint) {  // 이전 포인트가 방향(endPoint)이 없다면 
                        if (index === 1) {
                            const lastPoint = newPoints[newPoints.length - 1]

                            if (lastPoint.endPoint) {
                                newSegments.push(
                                    Segment.C(lastPoint.endPoint[0], lastPoint.endPoint[1], p.reversePoint[0], p.reversePoint[1], p.point[0], p.point[1])
                                );
                            } else {
                                newSegments.push(
                                    Segment.Q(p.reversePoint[0], p.reversePoint[1], p.point[0], p.point[1])
                                );
                            }

                        } else {
                            newSegments.push(
                                Segment.Q(p.reversePoint[0], p.reversePoint[1], p.point[0], p.point[1])
                            );
                        }

                    } else if (!p.reversePoint) {   // 마지막 포인트가 reversePoint 없다면 앞의 endPoint 로 Q 를 만들어준다. 
                        newSegments.push(
                            Segment.Q(prevPoint.endPoint[0], prevPoint.endPoint[1], p.point[0], p.point[1])
                        );
                    } else {
                        newSegments.push(
                            Segment.C(prevPoint.endPoint[0], prevPoint.endPoint[1], p.reversePoint[0], p.reversePoint[1], p.point[0], p.point[1])
                        );

                    }
                }
            })

            newGroupSegments.push(...newSegments)
        })

        const newPath = new PathParser();
        newPath.resetSegments(newGroupSegments);

        return newPath;
    }

    // make segment function 
    Z() {
        this.segments.push(Segment.Z());

        return this;
    }

    M(x, y) {
        this.segments.push(Segment.M(x, y));
        return this;
    }

    L(x, y) {
        this.segments.push(Segment.L(x, y));
        return this;
    }

    C(x1, y1, x2, y2, x, y) {
        this.segments.push(Segment.C(x1, y1, x2, y2, x, y));
        return this;
    }

    Q(x1, y1, x, y) {
        this.segments.push(Segment.Q(x1, y1, x, y));
        return this;
    }


    // static method 

    static fromSegments(segments) {
        const path = new PathParser();

        path.resetSegments(segments);
        return path;
    }

    static fromSVGString(d = '') {
        return new PathParser(d);
    }

    /**
     * make rect path 
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     * @returns {PathParser}
     */
    static makeRect(x, y, width, height) {

        return PathParser.fromSegments([
            Segment.M(x, y),
            Segment.L(x + width, y),
            Segment.L(x + width, y + height),
            Segment.L(x, y + height),
            Segment.L(x, y),
            Segment.Z()
        ]);
    }


    /**
     * make line path
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {PathParser}
     */
    static makeLine(x, y, x2, y2) {
        return PathParser.fromSegments([
            Segment.M(x, y),
            Segment.L(x2, y2)
        ]);
    }

    /**
     * make circle path
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {PathParser}
     */
    static makeCircle(x, y, width, height) {
        // refer to https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves

        var segmentSize = 0.552284749831;
        const path = new PathParser();
        path.resetSegments([
            Segment.M(0, -1),
            Segment.C(segmentSize, -1, 1, -segmentSize, 1, 0),
            Segment.C(1, segmentSize, segmentSize, 1, 0, 1),
            Segment.C(-segmentSize, 1, -1, segmentSize, -1, 0),
            Segment.C(-1, -segmentSize, -segmentSize, -1, 0, -1),
            Segment.Z()
        ]);

        path.translate(1, 1).scale(width / 2, height / 2).translate(x, y);

        return path;
    }

    /**
     * make path by points 
     * 
     * @param {{x: number, y: number}[]} points 
     * @returns {PathParser}
     */
    static makePathByPoints(points = []) {
        const segments = points.map((p, index) => {
            if (index === 0) {
                return Segment.M(p.x, p.y);
            } else {
                return Segment.L(p.x, p.y);
            }
        })

        segments.push(Segment.Z());

        return PathParser.fromSegments(segments);
    }

    /**
     * make path by verties
     * 
     * @param {vec3[]} verties 
     * @returns {PathParser}
     */
    static makePathByVerties(verties = []) {
        const segments = verties.map((v, index) => {
            if (index === 0) {
                return Segment.M(v[0], v[1]);
            } else {
                return Segment.L(v[0], v[1]);
            }
        })
        segments.push(Segment.Z());

        return PathParser.fromSegments(segments);
    }

    /**
     * 다각형 그리기
     * 
     * @copilot
     * @param {number} width 
     * @param {number} height 
     * @param {number} count 
     * @returns {PathParser}
     */
    static makePolygon(width, height, count = 3) {
        const segments = []

        const centerX = width / 2;
        const centerY = height / 2;

        for (var i = 0; i < count; i++) {
            var angle = (i / count) * Math.PI * 2;
            var x = Math.cos(angle) * centerX + centerX;
            var y = Math.sin(angle) * centerY + centerY;
            if (i === 0) {
                segments.push(Segment.M(x, y))
            } else {
                segments.push(Segment.L(x, y))
            }
        }

        segments.push(Segment.Z())

        return PathParser.fromSegments(segments);
    }
}