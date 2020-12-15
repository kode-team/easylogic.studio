import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, MOVE, END, IF } from "@core/Event";
import { Length } from "@unit/Length";
import { clone, isNotUndefined } from "@core/functions/func";
import { mat4, vec3 } from "gl-matrix";
import { Transform } from "@property-parser/Transform";
import { TransformOrigin } from "@property-parser/TransformOrigin";
import { calculateAngle, calculateAngleForVec3, calculateMatrix, calculateMatrixInverse, calculateRotationOriginMat4, vertiesMap } from "@core/functions/math";
import { ArtBoard } from "@items/ArtBoard";
import { rectToVerties } from "@core/functions/collision";


var directionType = {
    1: 'to top left',
    2: 'to top right',
    3: 'to bottom right',
    4: 'to bottom left',
}

const SelectionToolEvent = class  extends UIElement {

    [EVENT('hideSelectionToolView')] () {
        
    }

    [EVENT('hideSubEditor')] (e) {
        this.toggleEditingPath(false);
    }

    [EVENT('finishPathEdit')] () {
        this.toggleEditingPath(false);
    }

    [EVENT('refreshSelectionTool')] (isInitializeMatrix = true) { 
        this.initSelectionTool(isInitializeMatrix);
    }

}

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class GroupSelectionToolView extends SelectionToolEvent {

    template() {
        return /*html*/`
    <div class='selection-view group-selection-view' ref='$selectionView'  style='display:none' >
        <div class='pointer-rect' ref='$pointerRect'></div>        
    </div>`
    }

    toggleEditingPath (isEditingPath) {
        this.refs.$selectionView.toggleClass('editing-path', isEditingPath);
    }
    
    checkEditMode () {
        return this.$editor.isSelectionMode(); 
    }

    [POINTERSTART('$pointerRect .rotate-pointer') + MOVE('rotateVertext') + END('rotateEndVertext')] (e) {
        this.state.moveType = 'rotate'; 

        // cache matrix 
        this.$selection.reselect();        
        this.verties = this.groupItem.verties();        
    }

    rotateVertext (dx, dy) {

        var distAngle = Math.floor(calculateAngleForVec3(this.verties[4], this.verties[5], [dx, dy, 0]));

        // 실제 움직인 angle 
        this.localAngle = this.angle + distAngle;

        this.groupItem.reset({
            transform: Transform.rotateZ(this.groupItem.transform, Length.deg(this.localAngle) ) 
        })

        const selectionMatrix = calculateRotationOriginMat4(distAngle, this.verties[5])

        // angle 을 움직였으니 어떻게 움직이지 ?  
        this.$selection.cachedItemVerties.forEach(item => {


            const newVerties = vertiesMap(
                item.verties, 
                mat4.multiply(
                    [], 
                    item.parentMatrixInverse, 
                    selectionMatrix
                )
            );      // 아이템을 먼저 그룹으로 회전을 하고 

            var lastAngle = calculateAngle(
                newVerties[4][0] - newVerties[5][0],
                newVerties[4][1] - newVerties[5][1],
            ) - 270
            
            const newTranslate = vec3.transformMat4(
                [], 
                newVerties[0], 
                calculateRotationOriginMat4(-lastAngle, newVerties[5])
            );

            const instance = this.$selection.get(item.id)

            if (instance) {
                instance.reset({
                    x: Length.px(newTranslate[0]), 
                    y: Length.px(newTranslate[1]),
                    transform: Transform.rotateZ(item.transform, Length.deg(lastAngle) ) 
                })
            }

        })

        this.renderPointers();
        this.emit('refreshCanvasForPartial', null, true)  
        this.emit('refreshSelectionStyleView');                      
    }

    rotateEndVertext (dx, dy) {

        // 마지막 변경 시점 업데이트 
        this.angle = this.localAngle; 

        // 개별 verties 의 캐쉬를 다시 한다. 
        this.$selection.reselect();   
        this.initMatrix(true);
        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'rotate selection pointer',
                this.$selection.cloneValue('x', 'y', 'width', 'height', 'transform')
            );  
        })                
    }


    [POINTERSTART('$pointerRect .pointer') + MOVE('moveVertext') + END('moveEndVertext')] (e) {
        const num = +e.$dt.attr('data-number')
        this.state.moveType = directionType[`${num}`]; 

        // cache matrix 
        this.$selection.doCache();
        this.$selection.reselect();
        this.cachedGroupItem = this.groupItem.matrix;
    }

    calculateNewOffsetMatrixInverse (vertextOffset, width, height, origin, itemMatrix) {

        const center = vec3.add(
            [], 
            TransformOrigin.scale(origin,width, height), 
            vec3.negate([], vertextOffset)
        );

        return calculateMatrixInverse(
            mat4.fromTranslation([], vertextOffset),
            mat4.fromTranslation([], center),
            itemMatrix,
            mat4.fromTranslation([], vec3.negate([], center)),
        );
    }

    calculateDistance (vertext, distVector, reverseMatrix) {
        // 1. 움직이는 vertext 를 구한다. 
        const currentVertext = vec3.clone(vertext);

        // 2. dx, dy 만큼 옮긴 vertext 를 구한다.        
        // - dx, dy 를 계산하기 전에 먼저 snap 을 실행한 다음 최종 dx, dy 를 구한다      
        const snap = this.$snapManager.check([
            vec3.add([], currentVertext, distVector)
        ]);

        const nextVertext = vec3.add([], currentVertext, vec3.add([], distVector, snap ));

        // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.             
        var currentResult = vec3.transformMat4([], currentVertext, reverseMatrix); 
        var nextResult = vec3.transformMat4([], nextVertext, reverseMatrix); 

        // 4. 복귀한 좌표에서 차이점을 구한다. 
        const realDist = vec3.transformMat4([], 
            vec3.add([], nextResult, vec3.negate([], currentResult)),
            this.$editor.matrixInverse
        )

        return realDist
    }

    moveGroupItem (lastStartVertext, newWidth, newHeight) {

        this.groupItem.reset({
            x: Length.px(lastStartVertext[0] + (newWidth < 0 ? newWidth : 0)),
            y: Length.px(lastStartVertext[1] + (newHeight < 0 ? newHeight : 0)),
            width: Length.px(Math.abs(newWidth)),
            height: Length.px(Math.abs(newHeight)),
        })    
    }   
    
    moveItemForGroup (it, newVerties, realDx = 0, realDy = 0) {

        const transformViewInverse = calculateMatrixInverse(
            mat4.fromTranslation([], newVerties[5]),
            it.itemMatrix,
            mat4.fromTranslation([], vec3.negate([], newVerties[5])),
        );

        const [newX, newY] = vec3.transformMat4([], newVerties[0], transformViewInverse);
        const newWidth = vec3.distance(newVerties[0], newVerties[1])
        const newHeight = vec3.distance(newVerties[0], newVerties[3])

        const instance = this.$selection.get(it.id)

        if (instance) {
            instance.reset({
                x: Length.px(newX + realDx), 
                y: Length.px(newY + realDy),
                width: Length.px(newWidth),
                height: Length.px(newHeight)
            })
            instance.recover();              
        }            
    }

    recoverItemForGroup (groupItem, scaleX, scaleY, realDx = 0, realDy = 0) {

        const accumulatedMatrix = groupItem.accumulatedMatrix;
        const accumulatedMatrixInverse = groupItem.accumulatedMatrixInverse;

        this.$selection.cachedItemVerties.forEach(it => {

            const localView = calculateMatrix(
                it.parentMatrixInverse,         // 5. 해당 객체의 parent 를 기준으로 좌표를 만들면 된다. 
                accumulatedMatrix,    // 4. 원래의 좌표로 다시 만들고 
                mat4.fromTranslation([], [realDx, realDy, 0]),      // 3. dx, dy 가 - 일 경우 실제로 움직이고
                mat4.fromScaling([], [scaleX, scaleY, 1]),  // 2. scale 을 먼저 실행한다음 
                accumulatedMatrixInverse          // 1. 기본 좌표로 돌리고 
            )



            const newVerties = vertiesMap(it.verties, localView);

            this.moveItemForGroup(it, newVerties);
        })

    }


    moveBottomRightVertext (distVector) {

        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateDistance(
            groupItem.verties[2],    // bottom right 
            distVector, 
            groupItem.accumulatedMatrixInverse
        );

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width + realDx;
        const newHeight = groupItem.height + realDy;

        const scaleX = newWidth / groupItem.width;
        const scaleY = newHeight / groupItem.height;
        if (scaleX >= 0 && scaleY >= 0) {

            // 마지막 offset x, y 를 구해보자. 
            const view = calculateMatrix(
                groupItem.directionMatrix['to top left'],
                this.calculateNewOffsetMatrixInverse (
                    [0, 0, 0], 
                    newWidth, newHeight, 
                    groupItem.originalTransformOrigin, 
                    groupItem.itemMatrix
                )
            );

            const lastStartVertext = mat4.getTranslation([], view);

            this.moveGroupItem (lastStartVertext, newWidth, newHeight);

            this.recoverItemForGroup(groupItem,scaleX, scaleY, 0, 0 );
        }

    }


    moveTopRightVertext (distVector) {
        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateDistance(
            groupItem.verties[1],    // top right 
            distVector, 
            groupItem.accumulatedMatrixInverse
        );

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width + realDx;
        const newHeight = groupItem.height - realDy;

        const scaleX = newWidth / groupItem.width;
        const scaleY = newHeight / groupItem.height;

        if (scaleX >= 0 && scaleY >= 0) {
            // 마지막 offset x, y 를 구해보자. 
            const view = calculateMatrix(
                groupItem.directionMatrix['to bottom left'],
                this.calculateNewOffsetMatrixInverse (
                    [0, newHeight, 0], 
                    newWidth, newHeight, 
                    groupItem.originalTransformOrigin, 
                    groupItem.itemMatrix
                )
            );        


            const lastStartVertext = mat4.getTranslation([], view);

            this.moveGroupItem (lastStartVertext, newWidth, newHeight);

            this.recoverItemForGroup(groupItem, scaleX, scaleY, 0, realDy);
        }
    }


    //TODO: 
    moveTopLeftVertext (distVector) {

        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateDistance(
            groupItem.verties[0],    // top left 
            distVector, 
            groupItem.accumulatedMatrixInverse
        );

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width - realDx;
        const newHeight = groupItem.height - realDy;

        const scaleX = newWidth / groupItem.width;
        const scaleY = newHeight / groupItem.height;

        if (scaleX >= 0 && scaleY >= 0) {
            // 마지막 offset x, y 를 구해보자. 
            const view = calculateMatrix(
                groupItem.directionMatrix['to bottom right'],
                this.calculateNewOffsetMatrixInverse (
                    [newWidth, newHeight, 0], 
                    newWidth, newHeight, 
                    groupItem.originalTransformOrigin, 
                    groupItem.itemMatrix
                )
            );        


            const lastStartVertext = mat4.getTranslation([], view);

            this.moveGroupItem (lastStartVertext, newWidth, newHeight);

            this.recoverItemForGroup(groupItem, scaleX, scaleY, realDx, realDy);
        }
    }

    //TODO: 
    moveBottomLeftVertext (distVector) {


        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateDistance(
            groupItem.verties[3],    // top left 
            distVector, 
            groupItem.accumulatedMatrixInverse
        );

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width - realDx;
        const newHeight = groupItem.height + realDy;

        const scaleX = newWidth / groupItem.width;
        const scaleY = newHeight / groupItem.height;

        if (scaleX >= 0 && scaleY >= 0) {
            // 마지막 offset x, y 를 구해보자. 
            const view = calculateMatrix(
                groupItem.directionMatrix['to top right'],
                this.calculateNewOffsetMatrixInverse (
                    [newWidth, 0, 0], 
                    newWidth, newHeight, 
                    groupItem.originalTransformOrigin, 
                    groupItem.itemMatrix
                )
            );        


            const lastStartVertext = mat4.getTranslation([], view);

            this.moveGroupItem (lastStartVertext, newWidth, newHeight);

            this.recoverItemForGroup(groupItem, scaleX, scaleY, realDx, 0);
        }

    }


    moveVertext (dx, dy) {
        let distVector = vec3.transformMat4([], [dx, dy, 0], this.$editor.matrixInverse);

        if (this.state.moveType === 'to bottom right') {        // 2
            this.moveBottomRightVertext(distVector);
        } else if (this.state.moveType === 'to top right') {
            this.moveTopRightVertext(distVector);
        } else if (this.state.moveType === 'to top left') {
            this.moveTopLeftVertext(distVector);
        } else if (this.state.moveType === 'to bottom left') {
            this.moveBottomLeftVertext(distVector);                                
        }    

        this.renderPointers();
        this.refreshSmartGuides();        
        this.emit('refreshCanvasForPartial', null, true)  
        this.emit('refreshSelectionStyleView');                         
    }

    moveEndVertext (dx, dy) {        
        this.$selection.reselect();
        this.emit('refreshSelectionStyleView');           
        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'move selection pointer',
                this.$selection.cloneValue('x', 'y', 'width', 'height', 'transform')
            );  
        })        
    }

    refreshSelectionToolView (dx, dy) {

        let distVector = vec3.transformMat4([], [dx, dy, 0], this.$editor.matrixInverse);

        //////  snap 체크 하기 
        const snap = this.$snapManager.check(this.cachedGroupItem.verties.map(v => {
            return vec3.add([], v, distVector)
        }), 3);

        const localDist = vec3.add([], distVector, snap);

        this.groupItem.reset({
            x: Length.px(this.cachedGroupItem.x + localDist[0]),
            y: Length.px(this.cachedGroupItem.y + localDist[1])
        })

        this.$selection.cachedItemVerties.forEach(it => {
            const instance = this.$selection.get(it.id)

            if (instance) {
                instance.reset({
                    x: Length.px(it.x + localDist[0]), 
                    y: Length.px(it.y + localDist[1]),
                })
            }                        
        })        

        this.refreshSmartGuides();
    }

    refreshSmartGuides () {
        // 가이드 라인 수정하기 
        const guides = this.$snapManager.findGuide(this.groupItem.guideVerties());
        this.emit('refreshGuideLine', guides);             
    }

    getSelectedElements() {
        const elements = this.$selection.ids.map(id => this.parent.state.cachedCurrentElement[id])
        
        return elements;
    }

    initSelectionTool(isInitializeMatrix = false) {

        if (this.$editor.isSelectionMode() && this.$el.isHide() && this.$selection.isMany) {
            this.$el.show();
        } else {
            if (this.$el.isShow() && this.$selection.isOne) this.$el.hide();
        }

        this.initMatrix(isInitializeMatrix);

        this.makeSelectionTool();


    }      

    get item () {
        const verties = this.verties || rectToVerties(0, 0, 0, 0);

        return new ArtBoard({
            parent: this.$selection.currentProject,
            x: Length.px(verties[0][0]),
            y: Length.px(verties[0][1]),
            width: Length.px(verties[2][0] - verties[0][0]),
            height: Length.px(verties[2][1] - verties[0][1]),
        })
    }

    initMatrix(isInitializeMatrix = false) {

        if (isInitializeMatrix) {
            // matrix 초기화 
            this.verties = clone(this.$selection.verties);
            this.angle = 0;
            this.localAngle = this.angle;
            this.groupItem = this.item;     
            this.cachedGroupItem = this.item.matrix;     
        } else {
            // 초기화 옵션이 없으면 아무것도 변경하지 않는다. 
            // matrix 초기화 
            // this.verties = clone(this.$selection.verties);
            // this.angle = 0;
            // this.localAngle = this.angle;
            // this.groupItem = this.item;     
            // this.cachedGroupItem = this.item.matrix;     
        }

    }

    makeSelectionTool() {

        this.renderPointers();

    }

    /**
     * 선택영역 컴포넌트 그리기 
     */
    renderPointers () {

        const verties = this.verties;
    
        if (!verties) return; 
        if (!this.groupItem) return;

        const {line, point} = this.createRenderPointers(vertiesMap(this.groupItem.verties(), this.$editor.matrix));
        this.refs.$pointerRect.updateDiff(line + point)
    }


    createPointer (pointer, number) {
        return /*html*/`
        <div class='pointer' data-number="${number}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px)" ></div>
        `
    }

    createRotatePointer (pointer, number) {
        if (pointer.length === 0) return '';        
        return /*html*/`
        <div class='rotate-pointer' data-number="${number}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px)" ></div>
        `
    }    

    createPointerRect (pointers) {
        if (pointers.length === 0) return '';

        return /*html*/`
        <svg class='line' overflow="visible">
            <path 
                d="M ${pointers[0][0]}, ${pointers[0][1]} L ${pointers[1][0]}, ${pointers[1][1]} L ${pointers[2][0]}, ${pointers[2][1]} L ${pointers[3][0]}, ${pointers[3][1]} Z" />
        </svg>`
    }    

    createRenderPointers(pointers) {
        return {
            line: this.createPointerRect(pointers), 
            point: [
                this.createPointer (pointers[0], 1),
                this.createPointer (pointers[1], 2),
                this.createPointer (pointers[2], 3),
                this.createPointer (pointers[3], 4),
                this.createRotatePointer (pointers[4], 5),                
            ].join('')
        }
    }

    [EVENT('refreshSelectionStyleView')] () {
        this.renderPointers()
    }
    
} 