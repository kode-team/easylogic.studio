
import { POINTERSTART, POINTEROVER, POINTEROUT, IF, PREVENT, SUBSCRIBE } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import { clone} from "el/sapa/functions/func";
import { mat4, vec3 } from "gl-matrix";
import { Transform } from "el/editor/property-parser/Transform";
import { TransformOrigin } from "el/editor/property-parser/TransformOrigin";
import { calculateAngle360, calculateAngleForVec3, calculateMatrix, calculateMatrixInverse, makeGuidePoint, round } from "el/utils/math";
import { getRotatePointer } from "el/utils/collision";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";

import './SelectionView.scss';

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

    [SUBSCRIBE('refreshSelectionTool')] (isShow = true) { 
        this.initSelectionTool(isShow);
    }

    [SUBSCRIBE('updateViewport')] () { 
        if (this.$selection.isOne && this.$modeView.isCurrentMode('CanvasView')) {        
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
            <div class='elf--selection-view one-selection-view' ref='$selectionView' style='display:none' >
                <div class='pointer-rect' ref='$pointerRect'></div>
            </div>
        `
    }

    [SUBSCRIBE('keymap.keydown')] (e) {
        const keyString = [
            e.altKey    ? 'ALT'     : '',
            e.ctrlKey   ? 'CTRL'    : '',
            e.shiftKey  ? 'SHIFT'   : '',
            e.metaKey   ? 'META'    : ''
        ].join("");

        if (e.shiftKey && keyString === 'SHIFT') {
            this.$el.attr('data-has-shift', 'true')
        } else {
            if (this.$el.attr('data-has-shift') === 'true') {
                this.$el.attr('data-has-shift', '')
            }

        }
    }

    [SUBSCRIBE('keymap.keyup')] (e) {
        this.$el.attr('data-has-shift', '')
    }    

    toggleEditingPath (isEditingPath) {
        this.$el.toggleClass('editing-path', isEditingPath);
    }
    
    [POINTERSTART('$pointerRect .rotate-pointer') + MOVE('rotateVertex') + END('rotateEndVertex')] (e) {
        this.state.moveType = 'rotate'; 
        this.initMousePoint = this.$viewport.getWorldPosition(e);        

        // this.$selection.doCache();

        this.$selection.reselect();            
        this.verties = clone(this.$selection.verties);
        this.$snapManager.clear();
        this.rotateTargetNumber = (+e.$dt.attr('data-number'));       
        this.refreshRotatePointerIcon()  
        this.state.dragging = true;  
        this.state.isRotate = true;       
        this.$config.set('set.move.control.point', true);                
    }

    rotateVertex () {
        const targetMousePoint = this.$viewport.getWorldPosition();
        const distVector = vec3.subtract([], targetMousePoint, this.initMousePoint);

        const targetRotatePointer = this.rotateTargetNumber === 4 ?  getRotatePointer(this.verties, 34) : this.verties[this.rotateTargetNumber];

        var distAngle = Math.floor(calculateAngleForVec3(
            targetRotatePointer, 
            this.verties[4], 
            distVector
        ));

        // 캐쉬된 matrix 중에 current 에 해당하는 것만 실행을 한다. 
        // 나머지는 부모의 좌표가 변경 됐기 때문에 자식의 좌표를 자동으로 변경한다. 
        let currentMatrix = this.$selection.cachedCurrentItemMatrix;
        const instance = this.$selection.current;

        if (instance) {

            let newTransform = Transform.addTransform(currentMatrix.transform, `rotateZ(${Length.deg(distAngle).round(1000)})`)

            if (this.$config.get('bodyEvent').shiftKey) {
                const newRotateX = Transform.get(newTransform, 'rotateZ');

                if (newRotateX[0]) {
                    const angle = newRotateX[0].value - newRotateX[0].value % this.$config.get('fixed.angle');

                    newTransform = Transform.rotateZ(newTransform, Length.deg(angle));
                }

            }

            instance.reset({
                transform: newTransform 
            })
        }

        this.state.dragging = true;
        this.command('setAttributeForMulti', 'change rotate', this.$selection.pack('transform'));                
    }

    rotateEndVertex () {
        this.state.dragging = false;     
        this.state.isRotate = false;           
        this.emit('recoverCursor');
        this.$config.set('set.move.control.point', false);        
        // 마지막 변경 시점 업데이트 
        this.verties = null;

        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'change rotate',
                this.$selection.pack('transform')
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
            let iconAngle = Math.floor(angle)  - 135;
            this.emit('refreshCursor', 'open_in_full', `rotate(${iconAngle} 12 12)`)
        } else {
            this.emit('recoverCursor');
        }

    }

    checkPointerIsNotMoved (e) {
        return Boolean(this.state.dragging) === false;
    }

    [POINTEROVER('$pointerRect .rotate-pointer') + IF('checkPointerIsNotMoved')] (e) {
        this.refreshRotatePointerIcon(e);
    }

    [POINTEROVER('$pointerRect .pointer') + IF('checkPointerIsNotMoved')] (e) {
        this.refreshPointerIcon(e);
    }

    [POINTEROUT('$pointerRect .pointer,.rotate-pointer') + IF('checkPointerIsNotMoved')] (e) {
        this.emit('recoverCursor');
    }

    [POINTERSTART('$pointerRect .pointer') + MOVE('moveVertex') + END('moveEndVertex')] (e) {
        this.refreshPointerIcon(e);
        this.state.dragging = true; 

        const num = +e.$dt.attr('data-number')
        const direction =  directionType[`${num}`];

        this.initMousePoint = this.$viewport.getWorldPosition(e);        
        this.state.moveType = direction; 
        this.state.moveTarget = num; 

        this.$selection.reselect();        
        this.$snapManager.clear();            
        this.verties = this.$selection.verties;

        const rotateZ = Transform.get(this.$selection.current.transform, 'rotateZ');
        this.hasRotate = rotateZ && rotateZ.length && rotateZ[0].value != 0

        this.$config.set('set.move.control.point', true);

    }

    calculateNewOffsetMatrixInverse (vertexOffset, width, height, origin, itemMatrix) {

        const center = vec3.subtract(
            [], 
            TransformOrigin.scale(origin,width, height), 
            vertexOffset
        );

        return calculateMatrixInverse(
            mat4.fromTranslation([], vertexOffset),
            mat4.fromTranslation([], center),
            itemMatrix,
            mat4.fromTranslation([], vec3.negate([], center)),
        );        
    }

    calculateDistance (vertex, distVector, reverseMatrix) {

        // 1. 움직이는 vertex 를 구한다. 
        const currentVertex = vec3.clone(vertex);

        // 2. dx, dy 만큼 옮긴 vertex 를 구한다.        
        // - dx, dy 를 계산하기 전에 먼저 snap 을 실행한 다음 최종 dx, dy 를 구한다      
        const snap = this.$snapManager.check([
            vec3.add([], currentVertex, distVector)
        ]);

        const nextVertex = vec3.add([], currentVertex, vec3.add([], distVector, snap ));

        // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.             
        var currentResult = vec3.transformMat4([], currentVertex, reverseMatrix); 
        var nextResult = vec3.transformMat4([], nextVertex, reverseMatrix); 

        // 4. 복귀한 좌표에서 차이점을 구한다. 
        const realDist = vec3.add([], nextResult, vec3.negate([], currentResult))

        return realDist
    }

    calculateRealDist (item, vertexIndex, distVector) {
        return this.calculateDistance(
            item.verties[vertexIndex],    // top center 
            distVector, 
            item.accumulatedMatrixInverse
        );
    }

    moveItem (instance, lastStartVertex, newWidth, newHeight) {

        if (instance) {

            const data = {
                x: Length.px(lastStartVertex[0] + (newWidth < 0 ? newWidth : 0)),
                y: Length.px(lastStartVertex[1] + (newHeight < 0 ? newHeight : 0)),
                width: Length.px(Math.abs(newWidth)),
                height: Length.px(Math.abs(newHeight)),
            }

            if (this.hasRotate) {
                // noop 
            } else {
                data.x = data.x.floor();
                data.y = data.y.floor();
                data.width = data.width.floor();
                data.height = data.height.floor();
            }

            instance.reset(data)    
        }

    }

    moveDirectionVertex (item, newWidth, newHeight, direction, directionNewVector) {

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

        const lastStartVertex = mat4.getTranslation([], view);

        this.moveItem (this.$model.get(item.id), lastStartVertex, newWidth, newHeight);
    }

    moveBottomRightVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {

            let [realDx, realDy] = this.calculateRealDist(item, 2, distVector)

            if (this.$config.get('bodyEvent').shiftKey) {
                realDy = realDx * item.height/item.width;
            }                

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width + realDx;
            const newHeight = item.height + realDy;

            this.moveDirectionVertex(item, newWidth, newHeight, 'to top left', [0, 0, 0])

        }
    }


    moveTopRightVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {

            let [realDx, realDy] = this.calculateRealDist(item, 1, distVector)

            if (this.$config.get('bodyEvent').shiftKey) {
                realDy = -(realDx * item.height/item.width);
            }

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width + realDx;
            const newHeight = item.height - realDy;

            this.moveDirectionVertex(item, newWidth, newHeight, 'to bottom left', [0, newHeight, 0])       
        }
    }


    moveTopLeftVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {
            let [realDx, realDy] = this.calculateRealDist(item, 0, distVector)

            if (this.$config.get('bodyEvent').shiftKey) {
                realDy = realDx * item.height/item.width;
            }

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height - realDy;            

            this.moveDirectionVertex(item, newWidth, newHeight, 'to bottom right', [newWidth, newHeight, 0])            
        }
    }


    moveTopVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {

            const [realDx, realDy] = this.calculateRealDist(item, 0, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width;
            const newHeight = item.height - realDy;

            this.moveDirectionVertex(item, newWidth, newHeight, 'to bottom', [newWidth/2, newHeight, 0]);  
        }
    }    



    moveBottomVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {
            const [realDx, realDy] = this.calculateRealDist(item, 3, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width;
            const newHeight = item.height + realDy;

            this.moveDirectionVertex(item, newWidth, newHeight, 'to top', [newWidth/2, 0, 0]);
        }
    }    


    moveRightVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {

            const [realDx, realDy] = this.calculateRealDist(item, 1, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width + realDx;
            const newHeight = item.height;

            this.moveDirectionVertex(item, newWidth, newHeight, 'to left', [0, newHeight/2, 0]);            
        }
    }       
    
    moveLeftVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {

            const [realDx, realDy] = this.calculateRealDist(item, 0, distVector)

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height;

            this.moveDirectionVertex(item, newWidth, newHeight, 'to right', [newWidth, newHeight/2, 0]);
        }
    }           


    moveBottomLeftVertex (distVector) {
        const item = this.$selection.cachedCurrentItemMatrix
        if (item) {

            let [realDx, realDy] = this.calculateRealDist(item, 3, distVector)

            if (this.$config.get('bodyEvent').shiftKey) {
                realDy = -(realDx * item.height/item.width);
            }            

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height + realDy;

            this.moveDirectionVertex(item, newWidth, newHeight, 'to top right', [newWidth, 0, 0]);
        }
    }


    moveVertex () {
        const targetMousePoint = this.$viewport.getWorldPosition();
        const distVector = vec3.subtract([], targetMousePoint, this.initMousePoint);

        if (this.state.moveType === 'to top left') {                // 1
            this.moveTopLeftVertex(distVector);        
        } else if (this.state.moveType === 'to top') {              // 11
            this.moveTopVertex(distVector);    
        } else if (this.state.moveType === 'to right') {           // 12
            this.moveRightVertex(distVector);                                    
        } else if (this.state.moveType === 'to bottom') {           // 13
            this.moveBottomVertex(distVector);                        
        } else if (this.state.moveType === 'to left') {           // 14
            this.moveLeftVertex(distVector);                                                
        } else if (this.state.moveType === 'to top right') {        // 2
            this.moveTopRightVertex(distVector);
        } else if (this.state.moveType === 'to bottom right') {     // 3
            this.moveBottomRightVertex(distVector);
        } else if (this.state.moveType === 'to bottom left') {      // 4 
            this.moveBottomLeftVertex(distVector);                                
        }    

        this.emit('setAttributeForMulti', this.$selection.pack('x', 'y', 'width', 'height'));

        this.state.dragging = true; 
    }

    moveEndVertex () {
        this.state.dragging = false;         
        this.emit('recoverCursor');
        this.$selection.reselect();
        this.$config.set('set.move.control.point', false);        

        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'move selection pointer',
                this.$selection.pack('x', 'y', 'width', 'height')
            );  
        })      
    }

    initSelectionTool(isShow = true) {
        if (this.$el.isShow() && this.$selection.isOne === false) {
             this.$el.hide();
        } else if (this.$el.isHide() && this.$selection.isOne) {
            this.$el.show();
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

        if (!this.$selection.cachedCurrentItemMatrix) {
            return ;
        }

        if (this.$selection.isEmpty) {
            return ;
        }

        const verties = this.$selection.verties;
        const selectionVerties = this.$selection.selectionVerties;              
        const parentVerties = this.$selection.current.parent.verties || [];              
        this.state.renderPointerList = [
            this.$viewport.applyVerties(verties),
            this.$viewport.applyVerties(selectionVerties),
            this.$viewport.applyVerties(parentVerties),
        ]


        const pointers = this.createRenderPointers(...this.state.renderPointerList);

        if (pointers) {
            const {line, parentRect, point, size} = pointers;
            this.refs.$pointerRect.updateDiff(line + parentRect + point + size)
        }


    }


    createPointer (pointer, number, rotate) {
        return /*html*/`
        <div class='pointer' data-number="${number}" data-pointer="${pointer}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px) rotateZ(${rotate||'0deg'})" ></div>
        `
    }

    createPointerSide (pointer, number, rotate, width, height) {
        return /*html*/`
        <div class='pointer' data-number="${number}" data-pointer="${pointer}" style="width: ${width}px; height: ${height}px;transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px) rotateZ(${rotate||'0deg'})" ></div>
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

    createParentRect(pointers = []) {
        if (pointers.length === 0) return '';

        return /*html*/`
        <svg class='line' overflow="visible">
            <path 
                d="
                    M ${pointers[0][0]}, ${pointers[0][1]} 
                    L ${pointers[1][0]}, ${pointers[1][1]} 
                    L ${pointers[2][0]}, ${pointers[2][1]} 
                    L ${pointers[3][0]}, ${pointers[3][1]} 
                    L ${pointers[0][0]}, ${pointers[0][1]}
                    Z
                " 
                stroke="red"
                />
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
                data-layout="${this.$selection.current.layout}"
                class='size-pointer' 
                style="transform: translate3d( calc(${newPointer[0]}px - 50%), calc(${newPointer[1]}px - 50%), 0px) rotateZ(${angle}deg)" >
               ${text}
            </div>
        `
    }

    createRenderPointers(pointers, selectionPointers, parentPointers) {

        const current = this.$selection.current; 

        if (current && current.is("text")) {
            if (current.width.value === 0 && current.height.value === 0) {
                return;
            }
        }

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
        const width = vec3.dist(pointers[0], pointers[1]);
        const height = vec3.dist(pointers[0], pointers[3]);

        return {
            line: this.createPointerRect(pointers, rotatePointer), 
            size: this.createSize(pointers),
            parentRect: this.createParentRect(parentPointers),
            point: [
                // 4 모서리에서도 rotate 가 가능하도록 맞춤 
                this.createRotatePointer (selectionPointers[0], 0),
                this.createRotatePointer (selectionPointers[1], 1),
                this.createRotatePointer (selectionPointers[2], 2),
                this.createRotatePointer (selectionPointers[3], 3),
                isArtBoard ? undefined : this.createRotatePointer (rotatePointer, 4, 'center center'),

                dist < 20 ? undefined : this.createPointerSide (vec3.lerp([], pointers[0], pointers[1], 0.5), 11, rotate, width, 5),
                dist < 20 ? undefined : this.createPointerSide (vec3.lerp([], pointers[1], pointers[2], 0.5), 12, rotate, 5, height),
                dist < 20 ? undefined : this.createPointerSide (vec3.lerp([], pointers[2], pointers[3], 0.5), 13, rotate, width, 5),
                dist < 20 ? undefined : this.createPointerSide (vec3.lerp([], pointers[3], pointers[0], 0.5), 14, rotate, 5, height),
                this.createPointer (pointers[0], 1, rotate),
                this.createPointer (pointers[1], 2, rotate),
                this.createPointer (pointers[2], 3, rotate),
                this.createPointer (pointers[3], 4, rotate),

                // center position 
                this.createPointer (pointers[4], 5, rotate),                
            ].join('')
        }
    }

    checkShow() {
        if (this.$selection.isOne) {
            if (this.$selection.hasChangedField('x', 'y', 'width', 'height', 'transform', 'transform-origin', 'perspective', 'perspective-origin')) {            
                return true; 
            }
        }

        return false; 
    }

    [SUBSCRIBE('refreshSelectionStyleView') + IF('checkShow')] () {
        this.renderPointers()
    }

    [SUBSCRIBE('hideSelectionToolView')] () {
        this.$el.hide();
    }

} 