import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, MOVE, END, BIND, IF, CLICK, DEBOUNCE, THROTTLE } from "@core/Event";
import { Length } from "@unit/Length";
import { isNotUndefined } from "@core/functions/func";
import GuideView from "../view/GuideView";
import icon from "@icon/icon";
import { rectToVerties } from "@core/functions/collision";
import { mat4, quat, vec3 } from "gl-matrix";
import { Transform } from "@property-parser/Transform";
import { TransformOrigin } from "@property-parser/TransformOrigin";
import { calculateAngle, calculateAngle360, calculateAnglePointDistance, degreeToRadian, radianToDegree } from "@core/functions/math";

var moveType = {
    'move': 'move',
    'to top': 'move',    
    'to top right': 'move',
    'to top left': 'move',
    'to bottom': 'move',    
    'to bottom right': 'move',
    'to bottom left': 'move',
    'to left': 'move',    
    'to right': 'move',
    'translate': 'transform',
    'transform-origin': 'transform',
    'rotate3d': 'transform'
}

var directionType = {
    1: 'to top left',
    2: 'to top right',
    3: 'to bottom right',
    4: 'to bottom left',
}

var iconType = {
    'artboard': 'artboard',
    'rect': 'rect',
    'circle': 'lens',
    'text': 'title',
    'image': 'image',
    'svg-path': 'edit',
    'svg-textpath': 'text_rotate',
    'svg-text': 'title',
}

const SelectionToolEvent = class  extends UIElement {

    [EVENT('hideSelectionToolView')] () {
        this.refs.$selectionTool.css({
            left: '-10000px',
            top: '-10000px'
        })
    }

    [EVENT('hideSubEditor')] (e) {
        this.toggleEditingPath(false);
    }

    [EVENT('openPathEditor')] () {
        var current = this.$selection.current;
        if (current && current.isSVG() && current.d) {
            this.toggleEditingPath(true);

            // box 모드 
            // box - x, y, width, height 고정된 상태로  path 정보만 변경 
            this.emit('showPathEditor', 'modify', {
                current,
                d: current.accumulatedPath().d,
            }) 
        }
    }

    [EVENT('finishPathEdit')] () {
        this.toggleEditingPath(false);
    }


    [EVENT('refreshSelectionTool')] () { 
        this.initSelectionTool();
    }

    [EVENT('makeSelectionTool')] (isScale) {
        if (isScale) {
            this.removeOriginalRect()   
        }
        let drawList = this.guideView.calculate();

        this.makeSelectionTool();

        if (this.$selection.length === 0){
            drawList = []                
        }

        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));
    }

}

const SelectionToolBind = class extends SelectionToolEvent {

    [BIND('$selectionTool')] () {

        var current = this.$selection.current;
        var isLayoutItem = current && current.isLayoutItem()
        var hasLayout = current && current.hasLayout()
        var layout = current && (current.layout || current.parent.layout);

        return {
            'data-is-layout-item': isLayoutItem,
            'data-is-layout-container': hasLayout,
            'data-layout-container': layout,
            // 1개의 객체를 선택 했을 때 move 판은 이벤트를 걸지 않기 
            'data-selection-length': this.$selection.length
        }
    }
}

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends SelectionToolBind {

    initialize() {
        super.initialize();

        this.guideView = new GuideView(this.$editor, this);
    }

    template() {
        return /*html*/`
    <div class='selection-view' ref='$selectionView' >
        <div class='selection-tool' ref='$selectionTool' style='left:-100px;top:-100px;display:none;'>
            <div class='selection-tool-item' data-position='move' ref='$selectionMove' title='move'>
                <span class='icon' ref='$selectionIcon'>${icon.flag}</span>
                <span ref='$selectionTitle'></span>
            </div>       
            <div class='selection-tool-item' data-position='to top'></div>            
            <div class='selection-tool-item' data-position='to bottom'></div>            
            <div class='selection-tool-item' data-position='to left'></div>            
            <div class='selection-tool-item' data-position='to right'></div>
            <div class='selection-tool-item' data-position='to top right'></div>
            <div class='selection-tool-item' data-position='to bottom right'></div>
            <div class='selection-tool-item' data-position='to top left'></div>
            <div class='selection-tool-item' data-position='to bottom left'></div>
        </div>
        <div class='pointer-rect' ref='$pointerRect'></div>        
    </div>`
    }

    [CLICK('$selectionTool .selection-tool-item[data-position="path"]')] (e) {
        this.trigger('openPathEditor');
    }        

    toggleEditingPath (isEditingPath) {
        this.refs.$selectionTool.toggleClass('editing-path', isEditingPath);
    }
    
    checkEditMode () {
        return this.$editor.isSelectionMode(); 
    }

    [POINTERSTART('$pointerRect .pointer') + MOVE('moveVertext') + END('moveEndVertext')] (e) {
        const num = +e.$dt.attr('data-number')
        const direction =  directionType[`${num}`];
        this.state.moveType = direction; 
        this.state.moveTarget = num; 

    }

    calculateNewOffsetMatrixInverse (vertextOffset, width, height, origin, centerRate, itemMatrix) {

        const center = TransformOrigin.scale(origin,width, height)

        center[0] *= centerRate[0];
        center[1] *= centerRate[1];
        center[2] *= centerRate[2];

        const view = mat4.create();
        mat4.translate(view, view, vertextOffset);            
        mat4.translate(view, view, center )        
        mat4.multiply(view, view, itemMatrix)        
        mat4.translate(view, view, vec3.negate([], center))            

        return mat4.invert([], view); 
    }

    calculateDistance (vertext, dx, dy, reverseMatrix) {
        // 1. 움직이는 vertext 를 구한다. 
        const currentVertext = vec3.clone(vertext);

        // 2. dx, dy 만큼 옮긴 vertext 를 구한다.             
        const nextVertext = vec3.add([], currentVertext, [dx, dy, 0]);

        // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.             
        var currentResult = vec3.transformMat4([], currentVertext, reverseMatrix); 
        var nextResult = vec3.transformMat4([], nextVertext, reverseMatrix); 

        // 4. 복귀한 좌표에서 차이점을 구한다. 
        var realDx = (nextResult[0] - currentResult[0])/this.$editor.scale
        var realDy = (nextResult[1] - currentResult[1])/this.$editor.scale
        
        return [realDx, realDy, 0]
    }

    moveBottomRightVertext (dx, dy) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            const [realDx, realDy] = this.calculateDistance(
                item.verties[2],    // bottom right 
                dx, dy, 
                item.accumulatedMatrixInverse
            );

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width + realDx;
            const newHeight = item.height + realDy;

            // 마지막 offset x, y 를 구해보자. 
            const view = mat4.create();
            mat4.multiply(view, view, item.directionMatrix['to top left']);
            mat4.multiply(view, view, this.calculateNewOffsetMatrixInverse (
                [0, 0, 0], 
                newWidth, newHeight, 
                item.originalTransformOrigin, 
                [1,1,1], 
                item.itemMatrix
            ));

            const lastStartVertext = mat4.getTranslation([], view);

            const instance = this.$selection.items[0];
            instance.reset({
                x: Length.px(lastStartVertext[0]),
                y: Length.px(lastStartVertext[1]),
                width: Length.px(newWidth),
                height: Length.px(newHeight),
            })            
        }
    }


    moveTopRightVertext (dx, dy) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {


            const [realDx, realDy] = this.calculateDistance(
                item.verties[1],    // top right 
                dx, dy, 
                item.accumulatedMatrixInverse
            );

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width + realDx;
            const newHeight = item.height - realDy;

            // 마지막 offset x, y 를 구해보자. 
            const view = mat4.create();
            mat4.multiply(view, view, item.directionMatrix['to bottom left']);
            mat4.multiply(view, view, this.calculateNewOffsetMatrixInverse (
                [0, newHeight, 0], 
                newWidth, newHeight, 
                item.originalTransformOrigin, 
                [1,-1,1], 
                item.itemMatrix
            ));            


            const lastStartVertext = mat4.getTranslation([], view);         

            const instance = this.$selection.items[0];
            instance.reset({
                x: Length.px(lastStartVertext[0]),
                y: Length.px(lastStartVertext[1]),
                width: Length.px(newWidth),
                height: Length.px(newHeight),
            })            
        }
    }


    moveTopLeftVertext (dx, dy) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {


            const [realDx, realDy] = this.calculateDistance(
                item.verties[0],    // top left 
                dx, dy, 
                item.accumulatedMatrixInverse
            );

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height - realDy;            

            // 마지막 offset x, y 를 구해보자. 
            const view = mat4.create();
            mat4.multiply(view, view, item.directionMatrix['to bottom right']);
            mat4.multiply(view, view, this.calculateNewOffsetMatrixInverse (
                [newWidth, newHeight, 0], 
                newWidth, newHeight, 
                item.originalTransformOrigin, 
                [-1,-1,1], 
                item.itemMatrix
            ));                        


            const lastStartVertext = mat4.getTranslation([], view);         

            const instance = this.$selection.items[0];
            instance.reset({
                x: Length.px(lastStartVertext[0]),
                y: Length.px(lastStartVertext[1]),
                width: Length.px(newWidth),
                height: Length.px(newHeight),
            })            
        }
    }


    moveBottomLeftVertext (dx, dy) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {

            const [realDx, realDy] = this.calculateDistance(
                item.verties[3],    // bottom left
                dx, dy, 
                item.accumulatedMatrixInverse
            );

            // 변형되는 넓이 높이 구하기 
            const newWidth = item.width - realDx;
            const newHeight = item.height + realDy;

            // 마지막 offset x, y 를 구해보자. 
            const view = mat4.create();
            mat4.multiply(view, view, item.directionMatrix['to top right']);    // 고정점 
            mat4.multiply(view, view, this.calculateNewOffsetMatrixInverse (
                [newWidth, 0, 0], 
                newWidth, newHeight, 
                item.originalTransformOrigin, 
                [-1,1,1], 
                item.itemMatrix
            ));                    

            const lastStartVertext = mat4.getTranslation([], view);         

            const instance = this.$selection.items[0];
            instance.reset({
                x: Length.px(lastStartVertext[0]),
                y: Length.px(lastStartVertext[1]),
                width: Length.px(newWidth),
                height: Length.px(newHeight),
            })            
        }
    }


    moveVertext (dx, dy) {
        const item = this.$selection.cachedItemVerties[0]
        if (item) {
            if (this.state.moveType === 'to bottom right') {        // 2
                this.moveBottomRightVertext(dx, dy);
            } else if (this.state.moveType === 'to top right') {
                this.moveTopRightVertext(dx, dy);
            } else if (this.state.moveType === 'to top left') {
                this.moveTopLeftVertext(dx, dy);
            } else if (this.state.moveType === 'to bottom left') {
                this.moveBottomLeftVertext(dx, dy);                                
            }

            this.emit('refreshCanvasForPartial', null, true)            
        }
    }

    [POINTERSTART('$selectionView .selection-tool-item') + IF('checkEditMode') + MOVE() + END()] (e) {
        this.initMoveType(e.$dt);

        this.parent.selectCurrent(...this.$selection.items)

        this.$selection.doCache();

        this.initSelectionTool();
    }

    initMoveType ($target) {

        this.$target = $target || this.refs.$selectionTool.$('.selection-tool-item[data-position="move"]');

        if (this.$target) {
            this.pointerType = this.$target.attr('data-position')

            this.refs.$selectionTool.attr('data-selected-position', this.pointerType);
            this.refs.$selectionTool.attr('data-selected-movetype', moveType[this.pointerType]);
        }
    }

    move (dx, dy) {

        var e = this.$config.get('bodyEvent');


        if (e.shiftKey) {
            dy = dx; 
        }

        this.refreshSelectionToolView(dx, dy);
        // this.parent.updateRealPosition();    
        this.emit('refreshCanvasForPartial', null, true)     
    }

    end () {
        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refs.$selectionTool.attr('data-selected-movetype', '');

        this.emit('refreshAllElementBoundSize');
        this.emit('removeGuideLine')


        this.nextTick(() => {
            this.command(
                'setAttributeForMulti', 
                'move selection pointer',
                this.$selection.cloneValue('x', 'y', 'width', 'height')
            );  
        })

    }   

    refreshSelectionToolView (dx, dy, type) {
        if (dx === 0 && dy === 0) {
            // console.log(' not moved', dx, dy)
        } else {
            this.guideView.move(type || this.pointerType, dx / this.$editor.scale,  dy / this.$editor.scale )

            var drawList = this.guideView.calculate();
            this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));            
        }

        this.makeSelectionTool();        

    }

    getSelectedElements() {
        const elements = this.$selection.ids.map(id => this.parent.state.cachedCurrentElement[id])
        
        return elements;
    }

    getOriginalRect () {
        if (!this.originalRect) {
            this.originalRect = this.parent.$el.rect();
        }

        return this.originalRect;
    }

    getOriginalArtboardRect () {
        if (!this.originalArtboardRect) {
            this.originalArtboardRect = this.parent.refs.$view.rect();
        }

        return this.originalArtboardRect;
    }    


    removeOriginalRect () {
        this.originalArtboardRect = null
        this.originalRect = null
    }

    initSelectionTool() {
        this.$selection.reselect();

        this.removeOriginalRect();

        this.guideView.makeGuideCache();        

        var current = this.$selection.current;
        if (current) {
            var isPath = current.is('svg-path', 'svg-brush', 'svg-textpath');
            this.refs.$selectionTool.toggleClass('path', isPath);            
        } else {
            this.refs.$selectionTool.toggleClass('path', false);            
        }

        if (this.$editor.isSelectionMode() && this.$el.isHide()) {
            this.$el.show();
        }

        this.bindData('$selectionTool')

        this.makeSelectionTool();

    }      

    makeSelectionTool() {

        // selection 객체는 하나만 만든다. 
        this.guideView.recoverAll();

        var x = 0, y = 0, width = 0, height = 0;

        if (this.guideView.rect) {
            var {x, y, width, height} = this.calculateWorldPosition(this.guideView.rect) ;
        }

        if(x === 0 && y === 0 && width === 0 && height === 0) {
            x = -10000
            y = -10000
        } else if (!this.$selection.currentArtboard) {
            x = -10000
            y = -10000
        }

        this.refs.$selectionTool.css({ 
            left: Length.px(x), 
            top: Length.px(y), 
            width: Length.px(width), 
            height: Length.px(height) 
        })

        this.refreshPositionText(x, y, width, height)

        this.renderPointers();

    }


    refreshPositionText (x, y, width, height) {

        if (this.$selection.currentArtboard) {
            var newX = Length.px(x - this.$selection.currentArtboard.x.value / this.$editor.scale).round(1);
            var newY = Length.px(y - this.$selection.currentArtboard.y.value / this.$editor.scale).round(1);
            var newWidth = Length.px(width / this.$editor.scale).round(1);
            var newHeight = Length.px(height / this.$editor.scale).round(1);

            var text = ''
            switch(this.pointerType) {
                case 'move': text =  `X: ${newX}, Y: ${newY}`; break;
                case 'to top': text =  `Y: ${newY}, H: ${newHeight}`; break;         
                case 'to bottom': text =  `Y: ${newY}, H: ${newHeight}`; break;
                case 'to left': text =  `X: ${newX}, W: ${newWidth}`; break;
                case 'to right': text =  `X: ${newX}, W: ${newWidth}`; break;
                case 'to top right': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
                case 'to top left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
                case 'to bottom right': text =  `W: ${newWidth}, H: ${newHeight}`; break;
                case 'to bottom left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
            }
            
            this.setPositionText(text);

            var length = this.$selection.length;
            var title = ''; 

            if (length === 1) {
                var current = this.$selection.current
                title = current.title || current.getDefaultTitle();
                const iconString = icon[iconType[current.itemType] || iconType.rect]
                this.refs.$selectionIcon.html(iconString);  
            } else if (length >= 2) {
                title = `multi : ${length}`;
                this.refs.$selectionIcon.html(icon.flag);        
                this.refs.$selectionTool.toggleClass('path', false);        
            }
 
            this.refs.$selectionTitle.text(title)
            this.refs.$selectionMove.attr('title', title)
        }
    }

    setPositionText (text) {
        if (this.$target) {

            if (this.$selection.current && this.$selection.current.is('artboard')) {
                text = text.split(',').filter(it => {
                    return !it.includes('X:') && !it.includes('Y:');
                }).join(',');
            }

            this.$target.attr('data-position-text', text);
        }

    }
    

    calculateWorldPositionForGuideLine (list = []) {
        return list.map(it => {

            var A = this.calculateWorldPosition(it.A)
            var B = this.calculateWorldPosition(it.B)

            var ax, bx, ay, by; 

            if (isNotUndefined(it.ax)) { ax = it.ax * this.$editor.scale }
            if (isNotUndefined(it.bx)) { bx = it.bx * this.$editor.scale }
            if (isNotUndefined(it.ay)) { ay = it.ay * this.$editor.scale }
            if (isNotUndefined(it.by)) { by = it.by * this.$editor.scale }

            return { A,  B, ax,  bx, ay, by}
        })
    }

    calculateWorldPosition (item) {
        return {
            x: item.x * this.$editor.scale,
            y: item.y * this.$editor.scale,
            width: item.width  *  this.$editor.scale,
            height: item.height  * this.$editor.scale,
        }
    }

    /**
     * 선택영역 컴포넌트 그리기 
     */
    renderPointers () {

        if (this.$selection.isOne) {    // 하나 일 때랑 
            const lines = []
            const points = [] 
            this.$selection.each(item => {
                const {line, point} = this.createRenderPointers(item.verties())
                lines.push(line)
                points.push(point);
            })
            this.refs.$pointerRect.updateDiff(lines.join('') + points.join(''))            
        } else {        // 여러개를 선택했을 때량 동작이 다르다. 

            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;
            let maxX = Number.MIN_SAFE_INTEGER;
            let maxY = Number.MIN_SAFE_INTEGER;

            this.$selection.each(item => {

                item.verties().forEach(vector => {
                    if (minX > vector[0]) minX = vector[0]
                    if (minY > vector[1]) minY = vector[1]
                    if (maxX < vector[0]) maxX = vector[0]
                    if (maxY > vector[1]) maxY = vector[1]
                });

            })
            const {line, point} = this.createRenderPointers(rectToVerties(minX, minY, maxX - minX, maxY - minY))
            this.refs.$pointerRect.updateDiff(line + point)
        }

    }


    createPointer (pointer, number) {
        return /*html*/`
            <div class='pointer' data-number="${number}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px)" >
            </div>
        `
    }

    createPointerRect (pointers) {
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
            ].join('')
        }
    }

    [EVENT('refreshSelectionStyleView')] () {
        this.renderPointers()
    }
    
} 