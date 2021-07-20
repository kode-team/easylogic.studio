import { makeGuidePoint } from "el/base/functions/math";
import { Length } from "el/editor/unit/Length";
import { vec3 } from "gl-matrix";

export default class Transformer {
    constructor(editor) {
        this.editor = editor;
    }

    get $selection() {
        return this.editor.selection;
    }

    get $snapManager() {
        return this.editor.snapManager;
    }

    moveTo(distVector) {

        // 소수점은 버리자. 
        distVector = vec3.floor([], distVector);

        this.$selection.cachedItemVerties.forEach(it => {

            // 절대 좌표를 snap 기준으로 움직이고 
            const snap = this.$snapManager.check(it.verties.map(v => {
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
            const instance = this.$selection.get(it.id)

            if (instance) {
                instance.reset({
                    x: Length.px(it.x + newDist[0]),          // 1px 단위로 위치 설정 
                    y: Length.px(it.y + newDist[1]),
                })
            }
        })

        this.refreshSmartGuides();

    }


    refreshSmartGuides () {
        // 가이드 라인 수정하기 
        if (this.$selection.current) {


            const source = this.$selection.current; 
            const targetList = this.$selection.snapTargetLayers;

            // x축 가이드 설정하기 
            const xList = targetList.map(target => makeGuidePoint(source, target));

            xList.sort((a, b) => {
                return a[3] - b[3];
            });

            const list = [xList[0], xList[1]].filter(Boolean);

            const guides = this.$snapManager.findGuide(this.$selection.current.guideVerties);

            // console.log(guides);

            this.editor.emit('refreshGuideLine', [...list, ...guides]);             
        }

    }

}