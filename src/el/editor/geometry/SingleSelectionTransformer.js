import { getRotatePointer } from "el/base/functions/collision";
import { clone } from "el/base/functions/func";
import { calculateAngleForVec3, makeGuidePoint } from "el/base/functions/math";
import { vec3 } from "gl-matrix";
import { Transform } from "../property-parser/Transform";
import { Length } from "../unit/Length";

export default class SingleSelectionTransformer {
    constructor(editor) {
        this.editor = editor;
        this.verties = clone(editor.selection.verties);
        this.cachedItemVerties = this.editor.selection.cachedItemVerties;
    }

    // 회전 
    rotate(distVector, rotateTargetNumber, isShiftKey) {

        const targetRotatePointer = rotateTargetNumber === 4 ?  getRotatePointer(this.verties, 34) : this.verties[this.rotateTargetNumber];

        var distAngle = Math.floor(calculateAngleForVec3(
            targetRotatePointer, 
            this.verties[4], 
            distVector
        ));

        const results = {}

        this.cachedItemVerties.forEach(item => {


            let newTransform = Transform.addTransform(item.transform, `rotateZ(${Length.deg(distAngle).round(1000)})`)

            if (isShiftKey) {
                const newRotateX = Transform.get(newTransform, 'rotateZ');

                if (newRotateX[0]) {
                    const angle = newRotateX[0].value - newRotateX[0].value % this.$config.get('fixedAngle');

                    newTransform = Transform.rotateZ(newTransform, Length.deg(angle));
                }

            }


            results[item.id] = {
                transform: newTransform,
            }

        })

        return results;
    }

    // 이동 
    moveTo(distVector) {

        // 소수점은 버리자. 
        distVector = vec3.floor([], distVector);

        const results = {}

        this.cachedItemVerties.forEach(it => {

            // 절대 좌표를 snap 기준으로 움직이고 
            const snap = this.editor.snapManager.check(it.verties.map(v => {
                return vec3.add([], v, distVector)
            }));

            // snap 거리만큼 조정해서 실제로 움직인 좌표로 만들고 
            const localDist = vec3.add([], distVector, snap);

            // newVerties 에 실제 움직인 좌표로 넣고 
            const newVerties = it.verties.map(v => {
                return vec3.add([], v, localDist)
            })

            // 첫번째 좌표 it.rectVerties[0] 과 
            // 마지막 좌표 newVerties[0] 를 
            // parentMatrixInverse 기준으로 다시 원복하고 거리를 잰다 
            // 그게 실제적인 distance 이다. 
            const newDist = vec3.subtract(
                [],
                vec3.transformMat4([], newVerties[0], it.parentMatrixInverse),
                vec3.transformMat4([], it.verties[0], it.parentMatrixInverse)
            )

            results[it.id] = {
                x: Length.px(it.x + newDist[0]),          // 1px 단위로 위치 설정 
                y: Length.px(it.y + newDist[1]),
            }
        })

        return results;
    }


    refreshSmartGuides() {

        const editor = this.editor;
        const selection = editor.selection;
        const snapManager = editor.snapManager;

        const source = selection.current;
        const targetList = selection.snapTargetLayers;

        // x축 가이드 설정하기 
        const xList = targetList.map(target => makeGuidePoint(source, target));

        xList.sort((a, b) => {
            return a[3] - b[3];
        });

        const list = [xList[0], xList[1]].filter(Boolean);

        const guides = snapManager.findGuide(source.guideVerties);

        // console.log(guides);

        editor.emit('refreshGuideLine', [...list, ...guides]);


    }

}