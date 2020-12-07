import { isNotZero } from "@core/functions/func";
import { vec3 } from "gl-matrix";
import { Editor } from "./Editor";

const MAX_SNAP_DISTANCE = 3; 
const DEFAULT_DIST_VECTOR = vec3.fromValues(0, 0, 0)

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
        const verties  = item.verties();
        const xList = verties.map(it => it[0]) ;
        const yList = verties.map(it => it[1]) ;

        return {id: item.id, xList, yList}
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

}