import { isNotZero } from "el/base/functions/func";
import { vec3 } from "gl-matrix";

const MAX_SNAP_DISTANCE = 3; 
const DEFAULT_DIST_VECTOR = vec3.fromValues(0, 0, 0)
const AXIS_X = 'x';
const AXIS_Y = 'y';

function checkXAxis (sourceVertex, targetVertex) {
    return Math.abs(sourceVertex[0] - targetVertex[0]) < 1; 
}

function checkYAxis (sourceVertex, targetVertex) {
    return Math.abs(sourceVertex[1] - targetVertex[1]) < 1; 
}

function checkZAxis (sourceVertex, targetVertex) {
    return Math.abs(sourceVertex[2] - targetVertex[2]) < 1; 
}


/**
 * 드래그 하는 시점에 객체의 verties 를 캐쉬해두는 역할을 한다. 
 * 
 * @class SnapManager
 */
export class SnapManager {

    /**
     * 
     * @param {Editor} editor 
     */
    constructor (editor, snapDistance = MAX_SNAP_DISTANCE) {
        this.editor = editor;
        this.map = new Map();
        this.snapTargetLayers = []
        this.snapDistance = snapDistance;
    }

    get dist () {
        return this.editor.config.get('snap.distance') || this.snapDistance;
    }

    /**
     * 캐쉬된 item들의 matrix 정보를 삭제한다.
     */
    clear() {
        this.snapTargetLayers = this.editor.selection.snapTargetLayers.map(it => {
            return this.convertMatrix(it);
        });
    }


    convertMatrix (item) {
        const verties  = this.convertGuideAndPathMatrix(item);
        const xList = verties.map(it => it[0]) ;
        const yList = verties.map(it => it[1]) ;

        return {id: item.id, xList, yList, verties}
    }

    /**
     * 가이드, path 포인트 구하기 
     * 
     * @param {MovableItem} item 
     * @returns {vec3[]}
     */
    convertGuideAndPathMatrix (item) {
        const guideVerties  = item.guideVerties;
        const pathVerties  = item.pathVerties();

        return [...guideVerties, ...pathVerties];
    }    

    /**
     * snap 포인트 모으기 
     * 
     * @returns {vec3[]}
     */
    getSnapPoints () {
        const points = []
        this.editor.selection.snapTargetLayersWithSelection.forEach(it => {
            points.push.apply(points, this.convertGuideAndPathMatrix(it));
        });

        return points;
    }

    checkX (targetXList, sourceXList, dist = 0) {

        const checkXList = []

        targetXList.forEach((targetX, targetIndex) => {
            sourceXList.forEach((sourceX, sourceIndex) => {

                const localDistX = targetX - sourceX

                if (Math.abs(localDistX ) <= dist) {
                    checkXList.push({targetX, sourceX, sourceIndex, targetIndex, dx: localDistX})
                }

            })
        })

        return checkXList;
    }

    checkY (targetYList, sourceYList, dist = 0) {

        const checkYList = []

        targetYList.forEach((targetY, targetIndex) => {
            sourceYList.forEach((sourceY, sourceIndex) => {

                const localDistY = targetY - sourceY

                if (Math.abs(localDistY ) <= dist) {
                    checkYList.push({targetY, sourceY, sourceIndex, targetIndex, dy: localDistY})
                }

            })
        })

        return checkYList;
    }    

    /**
     * 
     * check target verties 
     * 
     * @param {vec3[]} sourceVerties 
     */
    check (sourceVerties) {
        const snaps = []
        const dist = this.dist;
        const sourceXList = sourceVerties.map(it => it[0])
        const sourceYList = sourceVerties.map(it => it[1])

        this.snapTargetLayers.forEach(target => {

            const x = this.checkX(target.xList, sourceXList, dist)[0];
            const y = this.checkY(target.yList, sourceYList, dist)[0];

            snaps.push(vec3.fromValues(x ? x.dx : 0, y ? y.dy : 0, 0))
        })

        return snaps.find(it => isNotZero(it[0]) || isNotZero(it[1])) || DEFAULT_DIST_VECTOR
    }

    checkPoint (sourceVertex) {
        const snap = this.check([sourceVertex])
        return vec3.add([], sourceVertex, snap);
    }

    /**
     * 점을 기준으로 가이드 라인 포인트 얻기 
     * 
     * @param {vec3[]} sourceVerties 
     * @param {vec3[]} targetVerties 
     * @returns {Array} [sourceVertex, targetVertex, AXIS_X or AXIS_Y ]
     */
    getGuidesByPointPoint (sourceVerties, targetVerties) {
        const points = []
        const groupPoints = {};        
        let sourceVertex, targetVertex;
        for (let sourceIndex = 0, sourceLength = sourceVerties.length; sourceIndex < sourceLength; sourceIndex++) {
            sourceVertex = sourceVerties[sourceIndex];


            const keyX = `${sourceVertex[0]}_x`
            const keyY = `${sourceVertex[1]}_y`

            if (!groupPoints[keyX]) {
                groupPoints[keyX] = [];
            }

            if (!groupPoints[keyY]) {
                groupPoints[keyY] = [];
            }

            for (let targetIndex = 0, targetLength = targetVerties.length; targetIndex < targetLength; targetIndex++) {
                targetVertex = targetVerties[targetIndex];

                // axis 가 정해지면 같은 그룹으로 묶는다. 거리(dist) 를 포함해서 
                if (checkXAxis(sourceVertex, targetVertex)) {        // x 좌표가 같을 때 , y 는 다를 때 
                    groupPoints[keyX].push([ sourceVertex, targetVertex, AXIS_X, vec3.dist(sourceVertex, targetVertex) ])
                } 

                if (checkYAxis(sourceVertex, targetVertex)) {        // x 좌표가 같을 때 , y 는 다를 때 
                    groupPoints[keyY].push([ sourceVertex, targetVertex, AXIS_Y, vec3.dist(sourceVertex, targetVertex) ])
                }                 
            }
        }

        // group으로 묶은 데이타 중에 최소 길이만 추출한다. 
        Object.keys(groupPoints).forEach(key => {
            if (groupPoints[key] && groupPoints[key].length) {
                const sorted = groupPoints[key].sort((a, b) => a[3] - b[3])
                const [sourceVertex, targetVertex, axis] = sorted[0]

                points.push([sourceVertex, targetVertex, axis])
            }
        })  

        return points;
    }

    findGuide (sourceVerties) {
        const guides = []

        this.snapTargetLayers.forEach(target => {

            // vertex 대 vertex 를 기준으로 좌표 설정 
            const points = this.getGuidesByPointPoint(sourceVerties, target.verties);

            guides.push.apply(guides, points);
        })

        return guides;
    }

    findGuideOne (sourceVerties) {
        return [this.findGuide(sourceVerties)[0]]
    }

}