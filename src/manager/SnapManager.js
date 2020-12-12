import { isNotZero } from "@core/functions/func";
import { vec3 } from "gl-matrix";
import { Editor } from "./Editor";

const MAX_SNAP_DISTANCE = 3; 
const DEFAULT_DIST_VECTOR = vec3.fromValues(0, 0, 0)
const AXIS_X = 'x';
const AXIS_Y = 'y';

function checkXAxis (sourceVertext, targetVertext) {
    return Math.abs(sourceVertext[0] - targetVertext[0]) < 1; 
}

function checkYAxis (sourceVertext, targetVertext) {
    return Math.abs(sourceVertext[1] - targetVertext[1]) < 1; 
}

function checkZAxis (sourceVertext, targetVertext) {
    return Math.abs(sourceVertext[2] - targetVertext[2]) < 1; 
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

    /**
     * 캐쉬된 item들의 matrix 정보를 삭제한다.
     */
    clear() {
        this.snapTargetLayers = this.editor.selection.snapTargetLayers.map(it => {
            return this.convertMatrix(it);
        });
    }


    convertMatrix (item) {
        const verties  = item.guideVerties();
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
        const guideVerties  = item.guideVerties();
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
            points.push(...this.convertGuideAndPathMatrix(it));
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
        const dist = this.snapDistance;
        const sourceXList = sourceVerties.map(it => it[0])
        const sourceYList = sourceVerties.map(it => it[1])

        this.snapTargetLayers.forEach(target => {

            const x = this.checkX(target.xList, sourceXList, dist)[0];
            const y = this.checkY(target.yList, sourceYList, dist)[0];

            snaps.push(vec3.fromValues(x ? x.dx : 0, y ? y.dy : 0, 0))
        })

        return snaps.find(it => isNotZero(it[0]) || isNotZero(it[1])) || DEFAULT_DIST_VECTOR
    }

    getGuidesByPointPoint (sourceVerties, targetVerties) {
        const points = []

        sourceVerties.forEach((sourceVertext) => {
            targetVerties.forEach((targetVertext) => {
                
                if (checkXAxis(sourceVertext, targetVertext)) {        // x 좌표가 같을 때 , y 는 다를 때 
                    points.push([ sourceVertext, targetVertext, AXIS_X])
                } 

                if (checkYAxis(sourceVertext, targetVertext)) {        // x 좌표가 같을 때 , y 는 다를 때 
                    points.push([ sourceVertext, targetVertext, AXIS_Y])
                }                 

            })            
        })

        return points;
    }

    findGuide (sourceVerties) {
        const guides = []

        this.snapTargetLayers.forEach(target => {

            // vertext 대 vertext 를 기준으로 좌표 설정 
            const points = this.getGuidesByPointPoint(sourceVerties, target.verties);


            guides.push(...points);
        })

        return guides;
        // sourceVerties 는 항상 최신 좌표를 지정한다. 
        // guide 라인을 찾을 대상을 맞춰보자. 

        // 1. layer 
        // 레이어와 verties 를 비교할 때 나타낼 수 있는 표시 
        // 각 레이어의 verties 와 source verties 을 비교한다. 
        // vertext 끼리 비교하는거 하나 
        // 소스 레이어의 vector 와  target 레이어의 vector 를 비교 
        // 느슷한 관계를 표시. 
        // source verties 의 점과  target 레이어의 vector 비교 
        // 2. artboard 
    }

}