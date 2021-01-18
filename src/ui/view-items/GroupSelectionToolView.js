import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, POINTEROUT, POINTEROVER, MOVE, END, IF, PREVENT } from "@core/Event";
import { Length } from "@unit/Length";
import { clone, isNotUndefined } from "@core/functions/func";
import { mat4, vec3 } from "gl-matrix";
import { Transform } from "@property-parser/Transform";
import { TransformOrigin } from "@property-parser/TransformOrigin";
import { calculateAngle, calculateAngle360, calculateAngleForVec3, calculateMatrix, calculateMatrixInverse, calculateRotationOriginMat4, vertiesMap } from "@core/functions/math";
import { ArtBoard } from "@items/ArtBoard";
import { rectToVerties } from "@core/functions/collision";


var directionType = {
    1: 'to top left',
    2: 'to top right',
    3: 'to bottom right',
    4: 'to bottom left',
    11: 'to top',
    12: 'to right',
    13: 'to bottom',
    14: 'to left',    
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

    [EVENT('updateViewport')] (isInitializeMatrix = true) {
        if (this.$selection.isMany) {        
            this.initSelectionTool(isInitializeMatrix);
        }
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
        this.initMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);        

        // cache matrix 
        this.$selection.reselect();        
        this.verties = this.groupItem.verties();        
        this.rotateTargetNumber = (+e.$dt.attr('data-number')); 

        this.refreshRotatePointerIcon()
        this.state.dragging = true;    
    }

    rotateVertext () {
        const e = this.$config.get('bodyEvent')
        const targetMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);
        const distVector = vec3.subtract([], targetMousePoint, this.initMousePoint);

        // this.verties[4] 는 origin 기준으로 y 가 0 인 좌표인데 
        // 나중에  다른 방향에서 돌릴 수 있게 되면 해당 영역의 vertext 를 지정해야 각도를 맞출 수 있다. 
        var distAngle = Math.floor(calculateAngleForVec3(this.verties[this.rotateTargetNumber], this.verties[5], distVector));

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

        this.state.dragging = true;        
        this.renderPointers();
        this.emit('refreshCanvasForPartial', null, true)  
        this.emit('refreshSelectionStyleView');     
        this.emit('refreshRect');                 
    }

    rotateEndVertext () {

        this.state.dragging = false;        
        this.emit('recoverCursor');

        // 개별 verties 의 캐쉬를 다시 한다. 
        this.$selection.reselect();   
        this.initMatrix(true);
        this.renderPointers();        
        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'rotate selection pointer',
                this.$selection.cloneValue('x', 'y', 'width', 'height', 'transform')
            );  
        })                
    }


    refreshRotatePointerIcon (e) {
        this.emit('refreshCursor', 'rotate')
    }

    refreshPointerIcon (e) {

        const dataPointer = e.$dt.data('pointer');

        if (dataPointer) {

            const pointer = dataPointer.split(',').map(it => Number(it))

            const diff = vec3.subtract([], pointer, this.state.renderPointerList[0][5]);
            const angle = calculateAngle360(diff[0], diff[1]);
            let iconAngle = Math.floor(angle)  - 135
            this.emit('refreshCursor', 'open_in_full', `rotate(${iconAngle} 12 12)`)
        } else {
            this.emit('recoverCursor');
        }

    }

    checkPointerIsNotMoved (e) {
        return Boolean(this.state.dragging) === false;
    }

    [POINTEROVER('$pointerRect .rotate-pointer') + IF('checkPointerIsNotMoved') + PREVENT] (e) {
        this.refreshRotatePointerIcon(e);
    }

    [POINTEROVER('$pointerRect .pointer') + IF('checkPointerIsNotMoved') + PREVENT] (e) {
        this.refreshPointerIcon(e);            
    }

    [POINTEROUT('$pointerRect .pointer,.rotate-pointer') + IF('checkPointerIsNotMoved') + PREVENT] (e) {
        this.emit('recoverCursor');
    }    


    [POINTERSTART('$pointerRect .pointer') + PREVENT + MOVE('moveVertext') + END('moveEndVertext')] (e) {
        this.refreshPointerIcon(e);
        this.state.dragging = true; 
        const num = +e.$dt.attr('data-number')
        this.state.moveType = directionType[`${num}`]; 
        this.initMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);        

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
        const realDist = vec3.add([], nextResult, vec3.negate([], currentResult))

        return realDist
    }

   
    calculateRealDist (item, vertextIndex, distVector) {
        return this.calculateDistance(
            item.verties[vertextIndex],    // top center 
            distVector, 
            item.accumulatedMatrixInverse
        );
    } 

    moveGroupItem (lastStartVertext, newWidth, newHeight) {

        this.groupItem.reset({
            x: Length.px(lastStartVertext[0] + (newWidth < 0 ? newWidth : 0)),
            y: Length.px(lastStartVertext[1] + (newHeight < 0 ? newHeight : 0)),
            width: Length.px(Math.abs(newWidth)).round(),
            height: Length.px(Math.abs(newHeight)).round(),
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

        const [realDx, realDy] = this.calculateRealDist(groupItem, 2, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width + realDx;
        const newHeight = groupItem.height + realDy;

        this.moveDirectionVertext(groupItem, 0, 0, newWidth, newHeight, 'to top left', [0, 0, 0])                
    }


    moveTopRightVertext (distVector) {
        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateRealDist(groupItem, 1, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width + realDx;
        const newHeight = groupItem.height - realDy;

        this.moveDirectionVertext(groupItem, 0, realDy, newWidth, newHeight, 'to bottom left', [0, newHeight, 0])        
    }


    moveDirectionVertext(groupItem, realDx, realDy, newWidth, newHeight, direction, directionNewVector) {

        const scaleX = newWidth / groupItem.width;
        const scaleY = newHeight / groupItem.height;

        if (scaleX >= 0 && scaleY >= 0) {
            // 마지막 offset x, y 를 구해보자. 
            const view = calculateMatrix(
                groupItem.directionMatrix[direction],
                this.calculateNewOffsetMatrixInverse (
                    directionNewVector, 
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

    moveTopVertext (distVector) {
        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateRealDist(groupItem, 0, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width;
        const newHeight = groupItem.height - realDy;

        this.moveDirectionVertext(groupItem, 0, realDy, newWidth, newHeight, 'to bottom', [newWidth/2, newHeight, 0])
    }    


    moveBottomVertext (distVector) {
        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateRealDist(groupItem, 2, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width;
        const newHeight = groupItem.height + realDy;

        this.moveDirectionVertext(groupItem, 0, 0, newWidth, newHeight, 'to top', [newWidth/2, 0, 0])        
    }        

    moveTopLeftVertext (distVector) {

        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateRealDist(groupItem, 0, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width - realDx;
        const newHeight = groupItem.height - realDy;

        this.moveDirectionVertext(groupItem, realDx, realDy, newWidth, newHeight, 'to bottom right', [newWidth, newHeight, 0])                        
    }


    moveLeftVertext (distVector) {

        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateRealDist(groupItem, 0, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width - realDx;
        const newHeight = groupItem.height;

        this.moveDirectionVertext(groupItem, realDx, 0, newWidth, newHeight, 'to right', [newWidth, newHeight/2, 0])
    }   
    

    moveRightVertext (distVector) {

        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateRealDist(groupItem, 2, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width + realDx;
        const newHeight = groupItem.height;


        this.moveDirectionVertext(groupItem, 0, 0, newWidth, newHeight, 'to left', [0, newHeight/2, 0])        
    }       

    moveBottomLeftVertext (distVector) {


        const groupItem = this.cachedGroupItem;

        const [realDx, realDy] = this.calculateRealDist(groupItem, 3, distVector);

        // 변형되는 넓이 높이 구하기 
        const newWidth = groupItem.width - realDx;
        const newHeight = groupItem.height + realDy;

        this.moveDirectionVertext(groupItem, realDx, 0, newWidth, newHeight, 'to top right', [newWidth, 0, 0])
    }


    moveVertext () {
        const e = this.$config.get('bodyEvent')
        const targetMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);
        const distVector = vec3.subtract([], targetMousePoint, this.initMousePoint);        

        if (this.state.moveType === 'to bottom right') {        // 2
            this.moveBottomRightVertext(distVector);
        } else if (this.state.moveType === 'to top right') {
            this.moveTopRightVertext(distVector);
        } else if (this.state.moveType === 'to top left') {
            this.moveTopLeftVertext(distVector);
        } else if (this.state.moveType === 'to bottom left') {
            this.moveBottomLeftVertext(distVector); 
        } else if (this.state.moveType === 'to top') {
            this.moveTopVertext(distVector);
        } else if (this.state.moveType === 'to left') {
            this.moveLeftVertext(distVector);
        } else if (this.state.moveType === 'to right') {
            this.moveRightVertext(distVector);
        } else if (this.state.moveType === 'to bottom') {
            this.moveBottomVertext(distVector);
        }    

        this.state.dragging = true; 
        this.renderPointers();
        this.refreshSmartGuides();        
        this.emit('refreshCanvasForPartial', null, true)  
        this.emit('refreshSelectionStyleView');                         
    }

    moveEndVertext (dx, dy) {        
        this.state.dragging = false;         
        this.emit('recoverCursor');   
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

    refreshSelectionToolView (newDist) {

        //////  snap 체크 하기 
        const snap = this.$snapManager.check(this.cachedGroupItem.rectVerties.map(v => {
            return vec3.add([], v, newDist)
        }), 3);

        const localDist = vec3.add([], snap, newDist);

        this.groupItem.reset({
            x: Length.px(this.cachedGroupItem.x + localDist[0]),
            y: Length.px(this.cachedGroupItem.y + localDist[1])
        })

        this.$selection.cachedItemVerties.forEach(it => {
            const instance = this.$selection.get(it.id)

            if (instance) {
                instance.reset({
                    x: Length.px(it.x + localDist[0]).round(),       // 1px 단위로 위치 설정 
                    y: Length.px(it.y + localDist[1]).round(),
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
            if (this.$el.isShow() && this.$selection.isMany === false) this.$el.hide();
        }

        this.initMatrix(isInitializeMatrix);

        this.makeSelectionTool();


    }      

    get item () {
        const verties = this.verties || rectToVerties(0, 0, 0, 0);

        if (!this.state.newArtBoard) {
            this.state.newArtBoard = new ArtBoard()
        } 

        this.state.newArtBoard.reset({
            parent: this.$selection.currentProject,
            x: Length.px(verties[0][0]),
            y: Length.px(verties[0][1]),
            width: Length.px(vec3.dist(verties[0], verties[1])),
            height: Length.px(vec3.dist(verties[0], verties[3])),
            transform: '', // 새로운 그룹을 지정할 때는 transform 은 항상 초기화 된다. 
        })

        return this.state.newArtBoard; 
    }

    initMatrix(isInitializeMatrix = false) {
        if (isInitializeMatrix && this.$selection.isMany) {
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

        if (!this.groupItem) return;

        const verties = this.groupItem.verties();
        const selectionVerties = this.groupItem.selectionVerties();

        this.state.renderPointerList = [
            this.$viewport.applyVerties(verties),
            this.$viewport.applyVerties(selectionVerties)
        ]

        const {line, point} = this.createRenderPointers(...this.state.renderPointerList);
        this.refs.$pointerRect.updateDiff(line + point)
    }


    createPointer (pointer, number) {
        return /*html*/`
        <div    
            class='pointer' 
            data-number="${number}" 
            data-pointer="${pointer}" 
            style="
                transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px)
            " 
        ></div>
        `
    }

    createRotatePointer (pointer, number, direction = 'center center') {

        if (pointer.length === 0) return '';        

        if (number < 4) {
            return /*html*/`
            <div class='rotate-pointer no-fill' data-number="${number}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px) scale(1.8);" ></div>
            `            
        }        

        return /*html*/`
        <div class='rotate-pointer' data-number="${number}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px)" ></div>
        `
    }    

    createPointerRect (pointers) {
        if (pointers.length === 0) return '';


        const rotatePointer = vec3.multiply([], vec3.add([], pointers[0], pointers[1]), [0.5, 0.5, 1]);            
        const line = `
            M ${rotatePointer[0]},${rotatePointer[1]} 
            L ${pointers[4][0]}, ${pointers[4][1]} 
        `


        return /*html*/`
        <svg class='line' overflow="visible">
            <path 
                d="
                    M ${pointers[0][0]}, ${pointers[0][1]} 
                    L ${pointers[1][0]}, ${pointers[1][1]} 
                    L ${pointers[2][0]}, ${pointers[2][1]} 
                    L ${pointers[3][0]}, ${pointers[3][1]} 
                    L ${pointers[0][0]}, ${pointers[0][1]}
                    ${line}
                    Z
                " />
        </svg>`        
    }    

    createRenderPointers(pointers, selectionPointers) {
        return {
            line: this.createPointerRect(pointers), 
            point: [
                // 4모서리에서도 rotate 할 수 있도록 맞춤 
                // this.createRotatePointer (selectionPointers[0], 0, 'bottom right'),
                // this.createRotatePointer (selectionPointers[1], 1, 'bottom left'),
                // this.createRotatePointer (selectionPointers[2], 2, 'top left'),
                // this.createRotatePointer (selectionPointers[3], 3, 'top right'),
                this.createRotatePointer (pointers[4], 4, 'center center'),                
                this.createPointer (pointers[0], 1),
                this.createPointer (pointers[1], 2),
                this.createPointer (pointers[2], 3),
                this.createPointer (pointers[3], 4),
                this.createPointer (vec3.multiply([], vec3.add([], pointers[0], pointers[1]), [0.5, 0.5, 1]), 11),
                this.createPointer (vec3.multiply([], vec3.add([], pointers[1], pointers[2]), [0.5, 0.5, 1]), 12),
                this.createPointer (vec3.multiply([], vec3.add([], pointers[2], pointers[3]), [0.5, 0.5, 1]), 13),
                this.createPointer (vec3.multiply([], vec3.add([], pointers[3], pointers[0]), [0.5, 0.5, 1]), 14),                             
            ].join('')
        }
    }

    [EVENT('refreshSelectionStyleView')] () {

        if (this.$selection.isMany) {
            this.renderPointers()
        }

    }
    
} 