import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, DOUBLECLICK, KEYUP, KEY, PREVENT, STOP, BIND, DEBOUNCE, IF } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";
import { isNotUndefined } from "../../../util/functions/func";
import GuideView from "./GuideView";
import { MovableItem } from "../../../editor/items/MovableItem";
import icon from "../icon/icon";
import { Transform } from "../../../editor/css-property/Transform";
import Dom from "../../../util/Dom";
import { calculateAngle, getXYInCircle, getDist } from "../../../util/functions/math";

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends UIElement {

    initialize() {
        super.initialize();

        this.guideView = new GuideView();
    }

    template() {
        return /*html*/`
    <div class='selection-view' ref='$selectionView' >
        <div class='selection-tool' ref='$selectionTool' style='left:-100px;top:-100px;'>
            <div class='selection-tool-item' data-position='move'></div>
            <div class='selection-tool-item' data-position='path'>${icon.scatter}</div>
            <div class='selection-tool-item' data-position='rotate3d' ref='$rotate3d'>
                <div class='rotate-area' ref='$rotateArea'>
                    <div class='y'></div>                
                    <div class='x'></div>
                </div>            
                <div class='z' ref='$rotateZ'>
                    <div class='handle-top'></div>
                    <div class='handle-right'></div>
                    <div class='handle-left'></div>
                    <div class='handle-bottom'></div>
                    <div class='point'></div>                    
                </div>
                <div class='translate' ref='$translateZ'>
                    <div class='perspective-handle'></div>
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

    [EVENT('add.type')] () {
        this.$el.hide();
    }

    [DOUBLECLICK('$rotate3d')] (e) {

        if (e.altKey) {
            editor.selection.each(item => {
                item.reset({ 'transform-origin': '' })
            })
            this.bindData('$rotate3d')
        } else if (e.shiftKey) {
            editor.selection.each(item => {
                var transform = Transform.join(Transform.parseStyle(item.transform).filter(it => {
                    switch(it.type) {
                    case 'translate':
                    case 'translateX':
                    case 'translateY':
                    case 'translateZ':
                        return false; 
                    }
                    return true; 
                }))
    
                item.reset({ transform })
            })
            this.bindData('$rotateZ')
            this.bindData('$rotateArea')            
        } else {
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
            this.bindData('$rotateZ')
            this.bindData('$rotateArea')    
        }

        this.emit('refreshSelectionStyleView');

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
    
    [EVENT('hideSelectionToolView')] () {
        this.refs.$selectionTool.css({
            left: '-10000px',
            top: '-10000px'
        })
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
                changeEvent: 'updatePathItem',
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
                changeEvent: 'updatePolygonItem',
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

    setCacheBaseTrasnform (...args) {
        editor.selection.each((item, cachedItem) => {
            item.transformObj = Transform.parseStyle(item.transform);
            cachedItem.transformObj = Transform.parseStyle(cachedItem.transform);

            args.forEach(key => {
                cachedItem[key] = cachedItem.transformObj.filter(it => it.type === key)[0];    
            })

        })
    }

    setCacheRotateZ (rect) {
        var targetRect = this.$target.rect();
        this.rotateZCenter = {
            x: targetRect.x + targetRect.width/2, 
            y: targetRect.y + targetRect.height/2
        }
        this.rotateZStart = {
            x: rect.x + rect.width/2, 
            y: rect.y + rect.height/2 
        }

        this.setCacheBaseTrasnform('rotateZ', 'rotate');
    }

    setCachePerspective () {
        this.setCacheBaseTrasnform('perspective');
    }

    setCacheTransformOrigin () {

        this.hasTransformOrigin = true; 
        editor.selection.each((item, cachedItem) => {
            item.transformOrigin = item['transform-origin'].split(' ').map(it => {
                return it ? Length.parse(it) : Length.percent(50)
            });
            cachedItem.transformOrigin = item['transform-origin'].split(' ').map(it => {
                return it ? Length.parse(it) : Length.percent(50)
            });

            cachedItem.transformOriginX = cachedItem.transformOrigin[0] || Length.percent(50)
            cachedItem.transformOriginXtoPx = cachedItem.transformOriginX.toPx(cachedItem.screenWidth);
            cachedItem.transformOriginY = cachedItem.transformOrigin[1] || Length.percent(50)
            cachedItem.transformOriginYtoPx = cachedItem.transformOriginY.toPx(cachedItem.screenHeight);
        })

    }

    setCacheTranslate () {
        this.hasTranslate = true; 
        this.setCacheBaseTrasnform('translateX', 'translateY');        
    }

    setCacheTranslateZ () {

        this.hasTranslateZ = true; 
        this.setCacheBaseTrasnform('translateZ');        

    }

    setCacheRotateXY () {
        this.setCacheBaseTrasnform('rotateX', 'rotateY');        
    }

    checkEditMode () {
        return editor.isSelectionMode(); 
    }

    [POINTERSTART('$selectionView .selection-tool-item') + IF('checkEditMode') + MOVE() + END()] (e) {
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
            this.hasPerspective = $point.hasClass('perspective-handle') 
            this.hasTransformOrigin = false; 
            this.hasTranslate = false; 
            this.hasTranslateZ = false; 
            

            if (this.hasRotateZ) {
                this.setCacheRotateZ(rect)
            } else if (this.hasPerspective) {
                this.setCachePerspective();
            } else {

                if (e.altKey) {
                    this.setCacheTransformOrigin()
                } else if (e.shiftKey) {
                    this.setCacheTranslate();
                } else if (e.metaKey) {
                    this.setCacheTranslateZ();
                } else {
                    this.setCacheRotateXY () 
                }

            }

            this.parent.updateRealTransformWillChange();

        } else {
            this.initSelectionTool();
        }

    }

    setTransformValue (item, type, value) {

        var obj = item.transformObj.filter(it => it.type === type)[0]
        if (obj) {
            obj.value[0] = value.clone();
        } else {
            item.transformObj.push({ type: type, value: [value.clone()] })
        }    
    }

    [BIND('$rotate3d')] () {
        var current = editor.selection.current || { 'transform-origin'  : '50% 50%' }

        var [left, top] = current['transform-origin'].split(' ').map(it => {
            return Length.parse(it || '50%');
        })

        left = left || Length.percent(50)
        top = top || Length.percent(50)
        
        return {
            style: {
                left, top 
            }
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


    modifyRotateZ(dx, dy) {
        var e = editor.config.get('bodyEvent');
        var x = this.rotateZStart.x - this.rotateZCenter.x
        var y = this.rotateZStart.y - this.rotateZCenter.y

        var angle1 = calculateAngle(x, y); 

        var x = this.rotateZStart.x + dx - this.rotateZCenter.x
        var y = this.rotateZStart.y + dy - this.rotateZCenter.y

        var angle = calculateAngle(x, y);

        var distAngle = Length.deg(angle - angle1);

       
        editor.selection.each((item, cachedItem) => {
            var tempRotateZ = Length.deg(0)

            if (cachedItem.rotateZ) { 
                tempRotateZ.set(cachedItem.rotateZ.value[0].value);
            } else if (cachedItem.rotate) {
                tempRotateZ.set(cachedItem.rotate.value[0].value);
            }

            tempRotateZ.add(distAngle.value);

            if (e.altKey) {
                tempRotateZ.add(- (tempRotateZ.value % 10)) 
            }


            this.setTransformValue(item, 'rotateZ', tempRotateZ);

            item.transform = Transform.join(item.transformObj);
        })
    }

    modifyPerspective(dx, dy) {
        var ry = Length.px(-dy / editor.scale)

        editor.selection.each((item, cachedItem) => {
            this.modifyCacheItem(item, cachedItem, Length.px(0), 'perspective', ry)

            item.transform = Transform.join(item.transformObj);
        })
    }

    modifyTransformOrigin (dx, dy) {
        editor.selection.each((item, cachedItem) => {
            var tempOriginX = Length.px(0)
            var tempOriginY = Length.px(0)

            if (cachedItem.transformOriginXtoPx) { 
                tempOriginX.set(cachedItem.transformOriginXtoPx.value);
            } 
            if (cachedItem.transformOriginYtoPx) { 
                tempOriginY.set(cachedItem.transformOriginYtoPx.value);
            }                         

            tempOriginX.add(dx / editor.scale);
            tempOriginY.add(dy / editor.scale);

            var x = tempOriginX.to(cachedItem.transformOriginX.unit, cachedItem.screenWidth);
            var y = tempOriginY.to(cachedItem.transformOriginY.unit, cachedItem.screenHeight);

            item['transform-origin'] = `${x} ${y}`
        })
    }

    modifyTranslate (dx, dy) {
        var rx = Length.px(dx / editor.scale)
        var ry = Length.px(dy / editor.scale)

        editor.selection.each((item, cachedItem) => {

            this.modifyCacheItem(item, cachedItem, Length.px(0), 'translateX', rx)
            this.modifyCacheItem(item, cachedItem, Length.px(0), 'translateY', ry)

            item.transform = Transform.join(item.transformObj);
        })
    }

    modifyTranslateZ (dx, dy) {
        var ry = Length.px(dy / editor.scale)
        
        editor.selection.each((item, cachedItem) => {

            this.modifyCacheItem(item, cachedItem, Length.px(0), 'translateZ', ry)

            item.transform = Transform.join(item.transformObj);
        })
    }

    modifyCacheItem (item, cachedItem, tempValue, key, dt) {
        
        if (cachedItem[key]) { 
            tempValue.set(cachedItem[key].value[0].value);
        } 

        tempValue.add(dt);

        this.setTransformValue(item, key, tempValue);
    }

    modifyRotateXY (dx, dy) {
        var rx = Length.deg(-dy / editor.scale)
        var ry = Length.deg(dx / editor.scale)

        editor.selection.each((item, cachedItem) => {

            this.modifyCacheItem(item, cachedItem, Length.deg(0), 'rotateX', rx)
            this.modifyCacheItem(item, cachedItem, Length.deg(0), 'rotateY', ry)

            item.transform = Transform.join(item.transformObj);
        })
    }

    move (dx, dy) {

        var e = editor.config.get('bodyEvent');

        if (this.pointerType === 'rotate3d') {

            if (this.hasRotateZ) {

                this.modifyRotateZ(dx, dy);
                this.bindData('$rotateZ')             

            } else if (this.hasPerspective) {
                this.modifyPerspective(dx, dy);
                
                this.bindData('$rotate3d')
                this.bindData('$rotateArea')   
            } else {

                if (this.hasTransformOrigin) {
                    this.modifyTransformOrigin(dx, dy);
                } else if (this.hasTranslate) {
                    this.modifyTranslate(dx, dy); 
                } else if (this.hasTranslateZ) {
                    this.modifyTranslateZ(dx, dy);
                } else {
                    this.modifyRotateXY (dx, dy);
                }
                this.bindData('$rotate3d')
                this.bindData('$rotateArea')                        
            }
            this.emit('refreshSelectionStyleView'); 

        } else {

            if (e.altKey) {
                dy = dx; 
            }
    
            this.refreshSelectionToolView(dx, dy);
            this.parent.updateRealPosition();    
            this.emit('refreshCanvasForPartial')     
            
            var current  = editor.selection.current;
            if (current.is('cube')) {
                this.emit('refreshStyleView', current);  
            }
                
        }
    }

    [EVENT('updateRealTransform')] () {
        this.parent.updateRealTransform()
    }

    end (dx, dy) {

        var e = editor.config.get('bodyEvent');

        if (e.altKey) {
            dy = dx; 
        }

        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refreshSelectionToolView(dx, dy);
        this.parent.trigger('removeRealPosition');                

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

    [EVENT('refreshSelectionTool', 'initSelectionTool')] () { 
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

        if (editor.isSelectionMode() && this.$el.isHide()) {
            this.$el.show();
        }

        this.bindData('$rotateZ')
        this.bindData('$rotateArea')

        this.makeSelectionTool();

    }    

    isNoMoveArea () {
        return editor.selection.items.length === 1 && editor.selection.current.is('text')
    }

    makeSelectionTool() {

        // selection 객체는 하나만 만든다. 
        this.guideView.recoverAll();

        var x = Length.px(0), y = Length.px(0), width = Length.px(0), height = Length.px(0);

        if (this.guideView.rect) {
            var {x, y, width, height} = this.calculateWorldPosition(this.guideView.rect) ;
        }

        if (this.isNoMoveArea()) {
            this.refs.$selectionTool.addClass('remove-move-area')
        } else {
            this.refs.$selectionTool.removeClass('remove-move-area')
        }

        if(x.is(0) && y.is(0) && width.is(0) && height.is(0)) {
            x.add(-10000);
            y.add(-10000);       
        } else if (!editor.selection.currentArtboard) {
            x.add(-10000);
            y.add(-10000);            
        }

        var left = x, top = y;

        this.refs.$selectionTool.css({ left, top, width, height })
        
        this.bindData('$rotate3d');
        this.bindData('$rotateArea');     
        
        this.refreshPositionText(x, y, width, height)

    }

    refreshPositionText (x, y, width, height) {

        if (editor.selection.currentArtboard) {
            var newX = Length.px(x.value - editor.selection.currentArtboard.x.value / editor.scale).round(1);
            var newY = Length.px(y.value - editor.selection.currentArtboard.y.value / editor.scale).round(1);
            var newWidth = Length.px(width.value / editor.scale).round(1);
            var newHeight = Length.px(height.value / editor.scale).round(1);

            var text = ''
            switch(this.pointerType) {
            case 'move': text =  `X: ${newX}, Y: ${newY}`; break;
            case 'to right': text =  `W: ${newWidth}`; break;
            case 'to left': text =  `X: ${newX}, W: ${newWidth}`; break;
            case 'to top': text =  `Y: ${newY}, H: ${newHeight}`; break;
            case 'to bottom': text =  `H: ${newHeight}`; break;
            case 'to top right': text =  `X: ${newX}, Y: ${newY} W: ${newWidth}, H: ${newHeight}`; break;
            case 'to top left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
            case 'to bottom right': text =  `W: ${newWidth}, H: ${newHeight}`; break;
            case 'to bottom left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
            }
            
            this.setPositionText(text);
        }
    }

    setPositionText (text) {
        if (this.$target) {
            this.$target.attr('data-position-text', text);
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

            return { A,  B, ax,  bx, ay, by}
        })
    }

    calculateWorldPosition (item) {
        var x = Length.px(item.x || 0);
        var y = Length.px(item.y || 0);

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

    [EVENT('refreshSelectionStyleView')] () {
        this.bindData('$rotate3d');
        this.bindData('$rotateArea');
        this.bindData('$rotateZ');
    }

    
} 