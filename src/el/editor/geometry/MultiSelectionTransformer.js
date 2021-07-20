import { getRotatePointer, rectToVerties } from "el/base/functions/collision";
import { clone } from "el/base/functions/func";
import { calculateAngle, calculateAngleForVec3, calculateRotationOriginMat4, makeGuidePoint, vertiesMap } from "el/base/functions/math";
import { mat4, vec3 } from "gl-matrix";
import { MovableItem } from "../items/MovableItem";
import { Transform } from "../property-parser/Transform";
import { Length } from "../unit/Length";

export default class MultiSelectionTransformer {
    constructor(editor) {
        this.editor = editor;
        this.cachedItemVerties = this.editor.selection.cachedItemVerties;
        this.verties = clone(this.editor.selection.verties);
        this.angle = 0;
        this.localAngle = this.angle;
        this.groupItem = this.item;
        this.cachedGroupItem = this.item.matrix;
    }


    get item() {

        const verties = this.verties || rectToVerties(0, 0, 0, 0);

        const artboard = new MovableItem()

        artboard.reset({
            parent: this.editor.selection.currentProject,
            x: Length.px(verties[0][0]),
            y: Length.px(verties[0][1]),
            width: Length.px(vec3.dist(verties[0], verties[1])),
            height: Length.px(vec3.dist(verties[0], verties[3])),
            transform: '', // 새로운 그룹을 지정할 때는 transform 은 항상 초기화 된다. 
        })

        return artboard;
    }

    // 회전 
    // 회전 
    rotate(distVector, rotateTargetNumber, isShiftKey) {

        const targetRotatePointer = rotateTargetNumber === 4 ?  getRotatePointer(this.verties, 34) : this.verties[rotateTargetNumber];


        const results = {}
        
        var distAngle = Math.floor(calculateAngleForVec3(
            targetRotatePointer, 
            this.verties[4], 
            distVector
        ));

        if (isShiftKey) {
            distAngle = distAngle - distAngle % this.editor.config.get('fixedAngle');
        }

        // 실제 움직인 angle 
        this.localAngle = this.angle + distAngle;

        this.groupItem.reset({
            transform: Transform.rotateZ(this.groupItem.transform, Length.deg(this.localAngle) ) 
        })

        const selectionMatrix = calculateRotationOriginMat4(distAngle, this.verties[4])

        // angle 을 움직였으니 어떻게 움직이지 ?  
        this.cachedItemVerties.forEach(item => {


            const newVerties = vertiesMap(
                item.verties, 
                mat4.multiply(
                    [], 
                    item.parentMatrixInverse, 
                    selectionMatrix
                )
            );      // 아이템을 먼저 그룹으로 회전을 하고 
    
            const rotatePointer = getRotatePointer(newVerties, 34)

            var lastAngle = calculateAngle(
                rotatePointer[0] - newVerties[4][0],
                rotatePointer[1] - newVerties[4][1],
            ) - 270
            
            const newTranslate = vec3.transformMat4(
                [], 
                newVerties[0], 
                calculateRotationOriginMat4(-lastAngle, newVerties[4])
            );

            results[item.id] = {
                x: Length.px(newTranslate[0]),
                y: Length.px(newTranslate[1]),
                transform: Transform.rotateZ(item.transform, Length.deg(lastAngle) ) 
            }
        })

        return results;
    }


    // 이동 
    moveTo(newDist) {

        newDist = vec3.floor([], newDist);
        const results = {}

        //////  snap 체크 하기 
        const snap = this.editor.snapManager.check(this.cachedGroupItem.rectVerties.map(v => {
            return vec3.add([], v, newDist)
        }), 3);

        const localDist = vec3.add([], snap, newDist);

        this.groupItem.reset({
            x: Length.px(this.cachedGroupItem.x + localDist[0]),
            y: Length.px(this.cachedGroupItem.y + localDist[1])
        })

        this.cachedItemVerties.forEach(it => {

            results[it.id] = {
                x: Length.px(it.x + localDist[0]).round(1000),       // 1px 단위로 위치 설정 
                y: Length.px(it.y + localDist[1]).round(1000),
            }
        })

        return results;
    }


    refreshSmartGuides() {

        const editor = this.editor;
        const selection = editor.selection;
        const snapManager = editor.snapManager;

        const source = this.groupItem;
        const targetList = selection.snapTargetLayers;

        // x축 가이드 설정하기 
        const xList = targetList.map(target => makeGuidePoint(source, target));

        xList.sort((a, b) => {
            return a[3] - b[3];
        });

        const list = [xList[0], xList[1]].filter(Boolean);

        const guides = snapManager.findGuide(this.groupItem.guideVerties);

        editor.emit('refreshGuideLine', [...list, ...guides]);


    }

}