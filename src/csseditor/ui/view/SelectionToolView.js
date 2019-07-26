import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, DOUBLECLICK, KEYUP, KEY, PREVENT, STOP, BIND } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";
import { isNotUndefined } from "../../../util/functions/func";
import GuideView from "./GuideView";
import { MovableItem } from "../../../editor/items/MovableItem";
import icon from "../icon/icon";
import { Transform } from "../../../editor/css-property/Transform";
import Dom from "../../../util/Dom";
import { calculateAngle } from "../../../util/functions/math";

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends UIElement {

    initialize() {
        super.initialize();

        this.guideView = new GuideView();
    }

    template() {
        return `
    <div class='selection-view' ref='$selectionView' >
        <div class='selection-tool' ref='$selectionTool'>
            <div class='selection-tool-item' data-position='move'></div>
            <div class='selection-tool-item' data-position='path'>${icon.scatter}</div>
            <div class='selection-tool-item' data-position='rotate3d' ref='$rotate3d'>
                <div class='rotate-area' ref='$rotateArea'>
                    <div class='y'></div>                
                    <div class='x'></div>
                </div>            
                <div class='z' ref='$rotateZ'>
                    <div class='point'></div>
                </div>                        
            </div>                        
            <div class='selection-tool-item' data-position='to top'></div>
            <div class='selection-tool-item' data-position='to right'></div>
            <div class='selection-tool-item' data-position='to bottom'></div>
            <div class='selection-tool-item' data-position='to left'></div>
            <div class='selection-tool-item' data-position='to top right'></div>
            <div class='selection-tool-item' data-position='to bottom right'></div>
            <div class='selection-tool-item' data-position='to top left'></div>
            <div class='selection-tool-item' data-position='to bottom left'></div>
        </div>
    </div>`
    }

    [DOUBLECLICK('$rotate3d')] (e) {
        editor.selection.each(item => {
            var transform = Transform.join(Transform.parseStyle(item.transform).filter(it => {
                switch(it.type) {
                case 'rotate':
                case 'rotate3d':
                case 'rotateX':
                case 'rotateY':                    
                case 'rotateZ':
                    return false; 
                }
                return true; 
            }))

            item.reset({ transform })
        })

        this.emit('refreshSelectionStyleView');
        this.bindData('$rotateZ')
        this.bindData('$rotateArea')
    }

    [DOUBLECLICK('$selectionTool .selection-tool-item[data-position="move"]')] (e) {
        this.trigger('openPathEditor');
    }    

    toggleEditingPath (isEditingPath) {
        this.refs.$selectionTool.toggleClass('editing-path', isEditingPath);
    }

    toggleEditingPolygon (isEditingPolygon) {
        this.refs.$selectionTool.toggleClass('editing-polygon', isEditingPolygon);
    }    

    [EVENT('hideSubEditor')] (e) {
        this.toggleEditingPath(false);
        this.toggleEditingPolygon(false);
    }

    [EVENT('openPathEditor')] () {
        var current = editor.selection.current;
        if (current && current.is('svg-path')) {
            this.toggleEditingPolygon(false);
            this.toggleEditingPath(true);
            this.emit('showPathEditor', 'modify', {
                current,
                d: current.d,
                screenX: current.screenX,
                screenY: current.screenY,
                screenWidth: current.screenWidth,
                screenHeight: current.screenHeight,
            }) 
        } else if (current.is('svg-polygon')) {
            this.trigger('openPolygonEditor');
        }
    }


    [EVENT('openPolygonEditor')] () {
        var current = editor.selection.current;
        if (current && current.is('svg-polygon')) {
            this.toggleEditingPath(false);            
            this.toggleEditingPolygon(true);
            this.emit('showPolygonEditor', 'modify', {
                current,
                points: current.points,
                screenX: current.screenX,
                screenY: current.screenY,
                screenWidth: current.screenWidth,
                screenHeight: current.screenHeight,
            }) 
        }
    }    

    [EVENT('finishPathEdit')] () {
        this.toggleEditingPath(false);
    }

    [EVENT('finishPolygonEdit')] () {
        this.toggleEditingPolygon(false);
    }    

    [EVENT('updatePathItem')] (pathObject) {

        var current = editor.selection.current;
        if (current) {
            if (current.is('svg-path')) {
                current.updatePathItem(pathObject);

                this.parent.selectCurrent(...editor.selection.items)

                editor.selection.setRectCache();        
    
                
                this.emit('refreshSelectionStyleView')
            }
        }

    }


    [EVENT('updatePolygonItem')] (polygonObject) {

        var current = editor.selection.current;
        if (current) {
            if (current.is('svg-polygon')) {
                current.updatePolygonItem(polygonObject);

                this.parent.selectCurrent(...editor.selection.items)

                editor.selection.setRectCache();        
    
                this.emit('refreshSelectionStyleView')
                this.emit('refreshCanvasForPartial', current);

            }
        }

    }    

    [POINTERSTART('$selectionView .selection-tool-item') + MOVE() + END()] (e) {
        this.$target = e.$delegateTarget;
        this.pointerType = e.$delegateTarget.attr('data-position')

        if (this.pointerType === 'path' || this.pointerType === 'polygon') {
            this.trigger('openPathEditor');
            return false;
        }

        this.refs.$selectionTool.attr('data-selected-position', this.pointerType);
        this.parent.selectCurrent(...editor.selection.items)

        editor.selection.setRectCache(this.pointerType === 'move' ? false: true);

        if (this.pointerType === 'rotate3d') {
            var $point = Dom.create(e.target);

            var rect = $point.rect()
            this.hasRotateZ = $point.hasClass('point') 

            

            if (this.hasRotateZ) {
                var targetRect = this.$target.rect();
                this.rotateZCenter = {
                    x: targetRect.x + targetRect.width/2, 
                    y: targetRect.y + targetRect.height/2
                }
                this.rotateZStart = {
                    x: rect.x + rect.width/2, 
                    y: rect.y + rect.height/2 
                }
                // 3d rotate 는 transform 속성이라 selection tool ui 를 변경하지 않는다. 
                editor.selection.each((item, cachedItem) => {
                    item.transformObj = Transform.parseStyle(item.transform);
                    cachedItem.transformObj = Transform.parseStyle(cachedItem.transform);

                    cachedItem.rotateZ = cachedItem.transformObj.filter(it => it.type === 'rotateZ')[0];
                    cachedItem.rotate = cachedItem.transformObj.filter(it => it.type === 'rotate')[0];

                })
            } else {

                // 3d rotate 는 transform 속성이라 selection tool ui 를 변경하지 않는다. 
                editor.selection.each((item, cachedItem) => {
                    item.transformObj = Transform.parseStyle(item.transform);
                    cachedItem.transformObj = Transform.parseStyle(cachedItem.transform);

                    cachedItem.rotateX = cachedItem.transformObj.filter(it => it.type === 'rotateX')[0];
                    cachedItem.rotateY = cachedItem.transformObj.filter(it => it.type === 'rotateY')[0];

                })
            }

        } else {
            this.initSelectionTool();
        }

    }

    setRotateValue (item, type, value) {

        var obj = item.transformObj.filter(it => it.type === type)[0]
        if (obj) {
            obj.value[0] = value.clone();
        } else {
            item.transformObj.push({ type: type, value: [value.clone()] })
        }    
    }

    [BIND('$rotateArea')] () {
        var current = editor.selection.current || { transform : '' }  

        var transform = Transform.join(Transform.parseStyle(current.transform).filter(it => {
            switch(it.type) {
            case 'rotateX':
            case 'rotateY':
                return true; 
            }

            return false; 
        }))
        return {
            style: {
                transform: `${transform}`
            }
        }
    }

    [BIND('$rotateZ')] () {
        var current = editor.selection.current || { transform : '' }  

        var transform = Transform.join(Transform.parseStyle(current.transform).filter(it => {
            switch(it.type) {
            case 'rotate':
            case 'rotateZ':
                return true; 
            }

            return false; 
        }))
        return {
            style: {
                transform: `${transform}`
            }
        }
    }


    move (dx, dy) {

        var e = editor.config.get('bodyEvent');

        if (e.altKey) {
            dy = dx; 
        }

        if (this.pointerType === 'rotate3d') {

            if (this.hasRotateZ) {

                var x = this.rotateZStart.x - this.rotateZCenter.x
                var y = this.rotateZStart.y - this.rotateZCenter.y

                var angle1 = calculateAngle(x, y) - 90; 

                var x = this.rotateZStart.x + dx - this.rotateZCenter.x
                var y = this.rotateZStart.y + dy - this.rotateZCenter.y

                var angle = calculateAngle(x, y) - 90;

                var distAngle = Length.deg(angle - angle1);

               
                editor.selection.each((item, cachedItem) => {
                    var tempRotateZ = Length.deg(0)
    
                    if (cachedItem.rotateZ) { 
                        tempRotateZ.set(cachedItem.rotateZ.value[0].value);
                    } else if (cachedItem.rotate) {
                        tempRotateZ.set(cachedItem.rotate.value[0].value);
                    }
    
                    tempRotateZ.add(distAngle.value);
    
                    this.setRotateValue(item, 'rotateZ', tempRotateZ);
    
                    item.transform = Transform.join(item.transformObj);
                })
                this.bindData('$rotateZ')
                this.emit('refreshSelectionStyleView'); 

            } else {

                var rx = Length.deg(-dy)
                var ry = Length.deg(dx)
    
                editor.selection.each((item, cachedItem) => {
                    var tempRotateX = Length.deg(0)
                    var tempRotateY = Length.deg(0)
    
                    if (cachedItem.rotateX) { 
                        tempRotateX.set(cachedItem.rotateX.value[0].value);
                    } 
                    if (cachedItem.rotateY) {
                        tempRotateY.set(cachedItem.rotateY.value[0].value);
                    }
    
                    tempRotateX.add(rx);
                    tempRotateY.add(ry);
    
                    this.setRotateValue(item, 'rotateX', tempRotateX);
                    this.setRotateValue(item, 'rotateY', tempRotateY);
    
                    item.transform = Transform.join(item.transformObj);
                })
                this.bindData('$rotateArea')
                this.emit('refreshSelectionStyleView');
    
            }

        } else {
            this.refreshSelectionToolView(dx, dy);
            this.parent.updateRealPosition();    
            this.emit('refreshCanvasForPartial')     
            
            var current  = editor.selection.current;
            if (current.is('cube')) {
                this.emit('refreshStyleView', current);  
            }
                
        }


    }

    end (dx, dy) {

        var e = editor.config.get('bodyEvent');

        if (e.altKey) {
            dy = dx; 
        }
                
        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refreshSelectionToolView(dx, dy);
        this.parent.trigger('removeRealPosition');                
        // this.initSelectionTool();

        // this.emit('refreshRedGL', false)
        this.emit('refreshCanvasForPartial')
        this.emit('refreshStyleView');
        this.emit('removeGuideLine')
    }   

    refreshSelectionToolView (dx, dy, type) {
        this.guideView.move(type || this.pointerType, dx / editor.scale,  dy / editor.scale )

        var drawList = this.guideView.calculate();

        this.makeSelectionTool();
        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));        
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

    [EVENT('refreshSelectionTool')] () {
        this.initSelectionTool();
    }

    [EVENT('initSelectionTool')] (type = 'move') {
        // this.pointerType = type; 
        this.initSelectionTool();
    }

    [EVENT('makeSelectionTool')] (isScale) {
        if (isScale) {
            this.removeOriginalRect()   
        }
        var drawList = this.guideView.calculate();

        this.makeSelectionTool();
        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));                
    }

    removeOriginalRect () {
        this.originalArtboardRect = null
        this.originalRect = null
    }

    initSelectionTool() {
        this.removeOriginalRect();

        this.guideView.makeGuideCache();        

        var current = editor.selection.current;
        if (current) {
            var isPath = current.is('svg-path');
            this.refs.$selectionTool.toggleClass('path', isPath);            

            var isPolygon = current.is('svg-polygon');
            this.refs.$selectionTool.toggleClass('polygon', isPolygon);
        }

        this.bindData('$rotate3d')

        this.makeSelectionTool();

    }    

    getWorldPosition () {
        var originalRect = this.getOriginalRect();
        var originalArtboardRect = this.getOriginalArtboardRect();

        return {
            left: originalArtboardRect.left - originalRect.left,
            top: originalArtboardRect.top - originalRect.top
        }
    }

    isNoMoveArea () {
        return editor.selection.items.length === 1 && editor.selection.current.is('redgl-canvas', 'text')
    }

    makeSelectionTool() {

        // selection 객체는 하나만 만든다. 

        this.guideView.recoverAll();

        var {x, y, width, height} = this.calculateWorldPosition(this.guideView.rect) ;


        if (this.isNoMoveArea()) {
            this.refs.$selectionTool.addClass('remove-move-area')
        } else {
            this.refs.$selectionTool.removeClass('remove-move-area')
        }

        this.refs.$selectionTool.cssText(`left: ${x};top:${y};width:${width};height:${height}`)

        var newX = Length.px(x.value - editor.selection.currentArtboard.x.value / editor.scale).round(1);
        var newY = Length.px(y.value - editor.selection.currentArtboard.y.value / editor.scale).round(1);
        var newWidth = Length.px(width.value / editor.scale).round(1);
        var newHeight = Length.px(height.value / editor.scale).round(1);

        switch(this.pointerType) {
        case 'move': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY}`); break; 
        case 'to right': this.$target.attr('data-position-text', `W: ${newWidth}`); break; 
        case 'to left': this.$target.attr('data-position-text', `X: ${newX}, W: ${newWidth}`); break; 
        case 'to top': this.$target.attr('data-position-text', `Y: ${newY}, H: ${newHeight}`); break; 
        case 'to bottom': this.$target.attr('data-position-text', `H: ${newHeight}`); break; 
        case 'to top right': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY} W: ${newWidth}, H: ${newHeight}`); break; 
        case 'to top left': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`); break; 
        case 'to bottom right': this.$target.attr('data-position-text', `W: ${newWidth}, H: ${newHeight}`); break; 
        case 'to bottom left': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`); break; 
        }
        
    }

    calculateWorldPositionForGuideLine (list = []) {
        return list.map(it => {

            var A = new MovableItem(this.calculateWorldPosition(it.A))
            var B = new MovableItem(this.calculateWorldPosition(it.B))

            var ax, bx, ay, by; 

            if (isNotUndefined(it.ax)) { ax = it.ax * editor.scale }
            if (isNotUndefined(it.bx)) { bx = it.bx * editor.scale }
            if (isNotUndefined(it.ay)) { ay = it.ay * editor.scale }
            if (isNotUndefined(it.by)) { by = it.by * editor.scale }

            return {
                A, 
                B,
                ax, 
                bx,
                ay,
                by
            }
        })
    }

    calculateWorldPosition (item) {
        var x = (item.x || Length.px(0));
        var y = (item.y || Length.px(0));

        return {
            x: Length.px(x.value * editor.scale),
            y: Length.px(y.value * editor.scale),
            width: Length.px(item.width.value  *  editor.scale),
            height: Length.px(item.height.value  * editor.scale),
            transform: item.transform
        }
    }

    [EVENT('refreshCanvas')] (obj = {}) {
        editor.selection.setRectCache();        

        this.initSelectionTool();
    }

    
} 