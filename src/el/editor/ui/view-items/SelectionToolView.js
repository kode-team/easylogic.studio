
import { POINTERSTART, POINTEROVER, POINTEROUT, MOVE, END, IF, PREVENT, KEYDOWN, SUBSCRIBE } from "el/base/Event";
import { Length } from "el/editor/unit/Length";
import { clone} from "el/base/functions/func";
import { mat4, vec3 } from "gl-matrix";
import { Transform } from "el/editor/property-parser/Transform";
import { TransformOrigin } from "el/editor/property-parser/TransformOrigin";
import { calculateAngle360, calculateAngleForVec3, calculateMatrix, calculateMatrixInverse, round } from "el/base/functions/math";
import { getRotatePointer } from "el/base/functions/collision";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

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

const SelectionToolEvent = class  extends EditorElement {

    [SUBSCRIBE('hideSubEditor')] (e) {
        this.toggleEditingPath(false);
    }

    [SUBSCRIBE('openPathEditor')] () {
        var current = this.$selection.current;
        if (current && current.isSVG() && current.d) {
            this.toggleEditingPath(true);

            // box 모드 
            // box - x, y, width, height 고정된 상태로  path 정보만 변경 
            this.emit('showPathEditor', 'modify', {
                box: 'canvas',
                current,
                d: current.accumulatedPath().d,
            }) 
        }
    }

    [SUBSCRIBE('finishPathEdit')] () {
        this.toggleEditingPath(false);
    }


    [SUBSCRIBE('refreshSelectionTool')] () { 
        this.initSelectionTool();
    }

    [SUBSCRIBE('updateViewport')] () { 
        if (this.$selection.isOne) {        
            this.initSelectionTool();
        }
    }    
}

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends SelectionToolEvent {

    template() {
        return /*html*/`
            <div class='selection-view one-selection-view' ref='$selectionView' style='display:none' >
                <div class='pointer-rect' ref='$pointerRect'></div>
            </div>
        `
    }

    [SUBSCRIBE('keymap.keydown')] (e) {
        if (e.shiftKey) {
            this.$el.attr('data-has-shift', 'true')
        }
    }

    [SUBSCRIBE('keymap.keyup')] (e) {
        this.$el.attr('data-has-shift', '')
    }    

    toggleEditingPath (isEditingPath) {
        this.$el.toggleClass('editing-path', isEditingPath);
    }
    
    checkEditMode () {
        return this.$editor.isSelectionMode(); 
    }

    [POINTERSTART('$pointerRect .rotate-pointer') + PREVENT + MOVE('rotateVertext') + END('rotateEndVertext')] (e) {
        this.state.moveType = 'rotate'; 
        this.initMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);        

        this.$selection.doCache();

        this.$selection.reselect();            
        this.verties = clone(this.$selection.verties);
        this.$snapManager.clear();
        this.rotateTargetNumber = (+e.$dt.attr('data-number'));       
        this.refreshRotatePointerIcon()  
        this.state.dragging = true;  
        this.state.isRotate = true;       
    }

    rotateVertext () {
        const e = this.$config.get('bodyEvent')
        const targetMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);
        const distVector = vec3.subtract([], targetMousePoint, this.initMousePoint);

        const targetRotatePointer = this.rotateTargetNumber === 4 ?  getRotatePointer(this.verties, 34) : this.verties[this.rotateTargetNumber];

        var distAngle = Math.floor(calculateAngleForVec3(
            targetRotatePointer, 
            this.verties[4], 
            distVector
        ));

        this.$selection.cachedItemVerties.forEach(item => {
            const instance = this.$selection.get(item.id)

            if (instance) {

                let newTransform = Transform.addTransform(item.transform, `rotateZ(${Length.deg(distAngle).round(1000)})`)

                if (this.$config.get('bodyEvent').shiftKey) {
                    const newRotateX = Transform.get(newTransform, 'rotateZ');

                    if (newRotateX[0]) {
                        const angle = newRotateX[0].value - newRotateX[0].value % this.$config.get('fixedAngle');

                        newTransform = Transform.rotateZ(newTransform, Length.deg(angle));
                    }

                }

                instance.reset({
                    transform: newTransform 
                })
            }

        })

        this.state.dragging = true;
        this.renderPointers();
        this.emit('refreshSelectionStyleView');   
        this.emit('refreshRect');                  
    }

    rotateEndVertext () {
        this.state.dragging = false;     
        this.state.isRotate = false;           
        this.emit('recoverCursor');
        
        // 마지막 변경 시점 업데이트 
        this.verties = null;

        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'move selection pointer',
                this.$selection.cloneValue('x', 'y', 'width', 'height')
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

            const diff = vec3.subtract([], pointer, this.state.renderPointerList[0][4]);
            const angle = calculateAngle360(diff[0], diff[1]);
            let iconAngle = Math.floor(angle)  - 130
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
        const direction =  directionType[`${num}`];

        this.initMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);        
        this.state.moveType = direction; 
        this.state.moveTarget = num; 

        this.$selection.doCache();

        this.$selection.reselect();        
        this.$snapManager.clear();            
        this.verties = this.$selection.verties;


    }

    calculateNewOffsetMatrixInverse (vertextOffset, width, height, origin, itemMatrix) {

        const center = vec3.subtract(
            [], 
            TransformOrigin.scale(origin,width, height), 
            vertextOffset
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
        const realDist = vec3.floor([], vec3.add([], nextResult, vec3.negate([], currentResult)))

        return realDist
    }

    calculateRealDist (item, vertextIndex, distVector) {
        return this.calculateDistance(
            item.verties[vertextIndex],    // top center 
            distVector, 
            item.accumulatedMatrixInverse
        );
    }

    moveItem (instance, lastStartVertext, newWidth, newHeight) {

        if (instance) {
            instance.reset({
                x: Length.px(lastStartVertext[0] + (newWidth < 0 ? newWidth : 0)),
                y: Length.px(lastStartVertext[1] + (newHeight < 0 ? newHeight : 0)),
                width: Length.px(Math.abs(newWidth)),
                height: Length.px(Math.abs(newHeight)),
            })    
            instance.recover();     
        }

    }

    moveDirectionVertext (item, newWidth, newHeight, direction, directionNewVector) {

        // 마지막 offset x, y 를 구해보자. 
        const view = calculateMatrix(
            item.directionMatrix[direction],
            this.calculateNewOffsetMatrixInverse (
                directionNewVector, 
                newWidth, newHeight, 
                item.originalTransformOrigin, 
                item.itemMatrix
            )
        );

        const lastStartVertext = mat4.getTranslation([], view);

        this.moveItem (this.$selection.get(item.id), lastStartVertext, newWidth, newHeight);
    }

    moveBottomRightVertext (distVector) {
        const verties = this.verties;
        if (verties) {

            this.$selection.cachedItemVerties.forEach(item => {

                let [realDx, realDy] = this.calculateRealDist(item, 2, distVector)

                if (this.$config.get('bodyEvent').shiftKey) {
                    realDy = realDx * item.height/item.width;
                }                
    
                // 변형되는 넓이 높이 구하기 
                const newWidth = item.width + realDx;
                const newHeight = item.height + realDy;
    
                this.moveDirectionVertext(item, newWidth, newHeight, 'to top left', [0, 0, 0])
            })


        }
    }


    moveTopRightVertext (distVector) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            let [realDx, realDy] = this.calculateRealDist(item, 1, distVector)

            if (this.$config.get('bodyEvent').shiftKey) {
                realDy = -(realDx * item.height/item.width);
            }

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width + realDx;
            const newHeight = item.height - realDy;

            this.moveDirectionVertext(item, newWidth, newHeight, 'to bottom left', [0, newHeight, 0])       
        }
    }


    moveTopLeftVertext (distVector) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {
            let [realDx, realDy] = this.calculateRealDist(item, 0, distVector)

            if (this.$config.get('bodyEvent').shiftKey) {
                realDy = realDx * item.height/item.width;
            }

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height - realDy;            

            this.moveDirectionVertext(item, newWidth, newHeight, 'to bottom right', [newWidth, newHeight, 0])            
        }
    }


    moveTopVertext (distVector) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            const [realDx, realDy] = this.calculateRealDist(item, 0, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width;
            const newHeight = item.height - realDy;

            this.moveDirectionVertext(item, newWidth, newHeight, 'to bottom', [newWidth/2, newHeight, 0]);  
        }
    }    



    moveBottomVertext (distVector) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            const [realDx, realDy] = this.calculateRealDist(item, 3, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width;
            const newHeight = item.height + realDy;

            this.moveDirectionVertext(item, newWidth, newHeight, 'to top', [newWidth/2, 0, 0]);
        }
    }    


    moveRightVertext (distVector) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            const [realDx, realDy] = this.calculateRealDist(item, 1, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width + realDx;
            const newHeight = item.height;

            this.moveDirectionVertext(item, newWidth, newHeight, 'to left', [0, newHeight/2, 0]);            
        }
    }       
    
    moveLeftVertext (distVector) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            const [realDx, realDy] = this.calculateRealDist(item, 0, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height;

            this.moveDirectionVertext(item, newWidth, newHeight, 'to right', [newWidth, newHeight/2, 0]);
        }
    }           


    moveBottomLeftVertext (distVector) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            let [realDx, realDy] = this.calculateRealDist(item, 3, distVector)

            if (this.$config.get('bodyEvent').shiftKey) {
                realDy = -(realDx * item.height/item.width);
            }            

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height + realDy;

            this.moveDirectionVertext(item, newWidth, newHeight, 'to top right', [newWidth, 0, 0]);
        }
    }


    moveVertext () {
        const e = this.$config.get('bodyEvent')
        const targetMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);
        const distVector = vec3.subtract([], targetMousePoint, this.initMousePoint);

        if (this.state.moveType === 'to top left') {                // 1
            this.moveTopLeftVertext(distVector);        
        } else if (this.state.moveType === 'to top') {              // 11
            this.moveTopVertext(distVector);    
        } else if (this.state.moveType === 'to right') {           // 12
            this.moveRightVertext(distVector);                                    
        } else if (this.state.moveType === 'to bottom') {           // 13
            this.moveBottomVertext(distVector);                        
        } else if (this.state.moveType === 'to left') {           // 14
            this.moveLeftVertext(distVector);                                                
        } else if (this.state.moveType === 'to top right') {        // 2
            this.moveTopRightVertext(distVector);
        } else if (this.state.moveType === 'to bottom right') {     // 3
            this.moveBottomRightVertext(distVector);
        } else if (this.state.moveType === 'to bottom left') {      // 4 
            this.moveBottomLeftVertext(distVector);                                
        }    

        this.state.dragging = true; 
        this.renderPointers();
        this.refreshSmartGuides();              
        this.emit('refreshSelectionStyleView');
        this.emit('refreshRect');
    }

    moveEndVertext () {
        this.state.dragging = false;         
        this.emit('recoverCursor');
        this.emit('refresh')
        this.$selection.reselect();

        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'move selection pointer',
                this.$selection.cloneValue('x', 'y', 'width', 'height')
            );  
        })        
    }

    moveTo (distVector) {

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
            const guides = this.$snapManager.findGuide(this.$selection.current.guideVerties());
            this.emit('refreshGuideLine', guides);             
        }

    }

    getSelectedElements() {
        const elements = this.$selection.ids.map(id => this.parent.state.cachedCurrentElement[id])
        
        return elements;
    }

    initSelectionTool() {

        if (this.$editor.isSelectionMode() && this.$el.isHide() && this.$selection.isOne) {
            this.$el.show();
        } else {
            if (this.$el.isShow() && this.$selection.isOne === false) this.$el.hide();
        }

        this.makeSelectionTool();

    }      

    makeSelectionTool() {
        this.renderPointers();
    }


    /**
     * 선택영역 컴포넌트 그리기 
     */
    renderPointers () {

        if (this.refs.$pointerRect.isHide()) {

            if (this.$selection.isEmpty) {
                // NOOP , 
                // 숨겨진 상태에서 선택도 아니면 모두 보여주지 않음 
            } else {
                this.refs.$pointerRect.show();

                const verties = this.$selection.verties;
                const selectionVerties = this.$selection.selectionVerties;
                const parentVector = mat4.getTranslation([], this.$selection.cachedItemVerties[0].parentMatrix);                
                this.state.renderPointerList = [
                    this.$viewport.applyVerties(verties),
                    this.$viewport.applyVerties(selectionVerties),
                    this.$viewport.applyVerties([parentVector])
                ]

                const {line, point, size} = this.createRenderPointers(...this.state.renderPointerList);
                this.refs.$pointerRect.updateDiff(line + point + size)
            }

        } else {
            if (this.$selection.isEmpty) {
                this.refs.$pointerRect.hide();
                // NOOP , 
                // 숨겨진 상태에서 선택도 아니면 모두 보여주지 않음                 
            } else {
                const verties = this.$selection.verties;
                const selectionVerties = this.$selection.selectionVerties;
                const parentVector = mat4.getTranslation([], this.$selection.cachedItemVerties[0].parentMatrix);
                this.state.renderPointerList = [
                    this.$viewport.applyVerties(verties),
                    this.$viewport.applyVerties(selectionVerties),
                    this.$viewport.applyVerties([parentVector])
                ]             

                const {line, point, size} = this.createRenderPointers(...this.state.renderPointerList);
                this.refs.$pointerRect.updateDiff(line + point + size)
            }
        }


    }


    createPointer (pointer, number, rotate) {
        return /*html*/`
        <div class='pointer' data-number="${number}" data-pointer="${pointer}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px) rotateZ(${rotate||'0deg'})" ></div>
        `
    }

    createRotatePointer (pointer, number, direction) {
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

    createPointerRect (pointers, rotatePointer, parentVector) {
        if (pointers.length === 0) return '';

        const current = this.$selection.current;         
        const isArtBoard = current && current.is('artboard');
        let line = '';
        if (!isArtBoard) {
            const centerPointer = vec3.lerp([], pointers[0], pointers[1], 0.5);            
            line += `
                M ${centerPointer[0]},${centerPointer[1]} 
                L ${rotatePointer[0]},${rotatePointer[1]} 
            `
        }

        // if (parentVector) {
        //     line += `
        //         M ${parentVector[0]},${parentVector[1]} 
        //         L ${pointers[0][0]},${pointers[0][1]} 
        //     `
        // }

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

    createSize (pointers) {
        const top = vec3.lerp([], pointers[0], pointers[1], 0.5);
        const right = vec3.lerp([], pointers[1], pointers[2], 0.5);
        const bottom = vec3.lerp([], pointers[2], pointers[3], 0.5);
        const left = vec3.lerp([], pointers[3], pointers[0], 0.5);

        const list = [
            { start: top, end: bottom}, 
            { start: right, end: left },
            { start: bottom, end: top }, 
            { start: left, end: right }
        ].map((it, index) => { 
            return { index, data: it }
        })

        list.sort((a, b) => {
            return a.data.start[1] > b.data.start[1] ? -1 : 1; 
        })

        const item = list[0];

        const newPointer  = vec3.lerp([], item.data.end, item.data.start, 1 + 16/vec3.dist(item.data.start, item.data.end))
        const width = this.$selection.current.width.value
        const height = this.$selection.current.height.value
        const diff = vec3.subtract([], item.data.start, item.data.end);
        const angle = calculateAngle360(diff[0], diff[1]) + 90;

        let text = `${round(width, 100)} x ${round(height, 100)}`;

        if (this.state.isRotate) {
            const rotateZ = Transform.get(this.$selection.current.transform, 'rotateZ')

            if (rotateZ) {
                text = `${round(rotateZ[0].value, 1000)}°`
            }
        }

        return /*html*/`
            <div 
                class='size-pointer' 
                style="transform: translate3d( calc(${newPointer[0]}px - 50%), calc(${newPointer[1]}px - 50%), 0px) rotateZ(${angle}deg)" >
               ${text}
            </div>
        `
    }

    createRenderPointers(pointers, selectionPointers, parentVector) {

        const current = this.$selection.current; 
        const isArtBoard = current && current.is('artboard');

        const diff = vec3.subtract(
            [], 
            vec3.lerp([], pointers[0], pointers[1], 0.5), 
            vec3.lerp([], pointers[0], pointers[2], 0.5), 
        );

        //TODO: 여기서는 법선벡터를 구하게 되면 식이 훨씬 간단해진다. 
        const rotate = Length.deg(calculateAngle360(diff[0], diff[1]) + 90).round(1000);

        const rotatePointer = getRotatePointer(pointers, 34)
        const dist = vec3.dist(pointers[0], pointers[2]);

        return {
            line: this.createPointerRect(pointers, rotatePointer, parentVector[0]), 
            size: this.createSize(pointers),
            point: [
                // 4 모서리에서도 rotate 가 가능하도록 맞춤 
                // isArtBoard ? undefined : this.createRotatePointer (selectionPointers[0], 0),
                // isArtBoard ? undefined : this.createRotatePointer (selectionPointers[1], 1),
                // isArtBoard ? undefined : this.createRotatePointer (selectionPointers[2], 2),
                // isArtBoard ? undefined : this.createRotatePointer (selectionPointers[3], 3),
                isArtBoard ? undefined : this.createRotatePointer (rotatePointer, 4, 'center center'),
                this.createPointer (pointers[0], 1, rotate),
                this.createPointer (pointers[1], 2, rotate),
                this.createPointer (pointers[2], 3, rotate),
                this.createPointer (pointers[3], 4, rotate),
                this.createPointer (pointers[4], 5, rotate),

                dist < 20 ? undefined : this.createPointer (vec3.lerp([], pointers[0], pointers[1], 0.5), 11, rotate),
                dist < 20 ? undefined : this.createPointer (vec3.lerp([], pointers[1], pointers[2], 0.5), 12, rotate),
                dist < 20 ? undefined : this.createPointer (vec3.lerp([], pointers[2], pointers[3], 0.5), 13, rotate),
                dist < 20 ? undefined : this.createPointer (vec3.lerp([], pointers[3], pointers[0], 0.5), 14, rotate),
            ].join('')
        }
    }

    [SUBSCRIBE('refreshSelectionStyleView')] () {

        if (this.$selection.isOne) {
            this.renderPointers()
        }

    }

} 

registElement({ SelectionToolView })