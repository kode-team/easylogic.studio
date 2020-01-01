import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, DOUBLECLICK, BIND } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";
import { Transform } from "../../../editor/css-property/Transform";
import { calculateAngle } from "../../../util/functions/math";

export default class RotateEditorView extends UIElement {
    template() {
        return /*html*/`
            <div class='rotate-editor-view'>
                <div class='rotate-area' ref='$rotateArea'>
                    <div class='rotate-container' ref='$rotateContainer'>
                        <div class='rotate-item rotate-x'></div>
                        <div class='rotate-item rotate-y'></div>
                    </div>
                </div>
                <div class='rotate-z' ref='$rotateZ'>
                    <div class='handle' ref='$handle'></div>
                    <div class='handle-line'></div>
                </div>                
            </div>
        `
    }

    [BIND('$rotateContainer')] () {

        var current = editor.selection.current || {transform: ''};

        var transform = Transform.filter(current.transform || '', it => {
            return it.type === 'rotateX' || it.type === 'rotateY'; 
        });

        return {
            style: {
                transform
            }
        }
    }

    [BIND('$rotateZ')] () {

        var current = editor.selection.current || {transform: ''};

        var transform = Transform.filter(current.transform || '', it => {
            return it.type === 'rotate' || it.type === 'rotateZ'; 
        });

        return {
            style: {
                transform
            }
        }
    }

    [DOUBLECLICK('$rotateArea')] () {
        editor.selection.each(item => {
            item.reset({ transform: Transform.remove(item.transform, ['rotateX', 'rotateY']) })
        })
        this.bindData('$rotateContainer');
        editor.selection.setRectCache()        
        this.emit('refreshCanvasForPartial', null, false, true)       
        this.emit('refreshSelectionStyleView'); 
    }

    [POINTERSTART('$rotateArea') + MOVE('moveRotateXY') + END('moveEndRotateXY')] () {
        this.setCacheRotateXY () 
    }


    setCacheRotateXY () {
        this.setCacheBaseTrasnform('rotateX', 'rotateY');        
    }    

    moveRotateXY (dx, dy) {
        this.modifyRotateXY (dx, dy);

        this.bindData('$rotateContainer');

        this.emit('refreshCanvasForPartial', null, false, true)

    }

    moveEndRotateXY (dx, dy) {
        editor.selection.setRectCache()        
        this.emit('refreshSelectionStyleView')
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

    [DOUBLECLICK('$handle')] () {
        editor.selection.each(item => {
            item.reset({ transform: Transform.remove(item.transform, ['rotateZ', 'rotate']) })
        })
        this.bindData('$rotateZ');        
        editor.selection.setRectCache()        
        this.emit('refreshCanvasForPartial', null, false, true)        
        this.emit('refreshSelectionStyleView')        
    }

    [POINTERSTART('$handle') + MOVE() + END()] () {
        this.setCacheRotateZ();
    }

    move (dx, dy) {
        this.modifyRotateZ(dx, dy);

        this.bindData('$rotateZ');

        this.emit('refreshCanvasForPartial', null, false, true)

    }

    end () {
        editor.selection.setRectCache()
        this.emit('refreshSelectionStyleView')
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


    setTransformValue (item, type, value) {

        var obj = item.transformObj.filter(it => it.type === type)[0]
        if (obj) {
            obj.value[0] = value.clone();
        } else {
            item.transformObj.push({ type: type, value: [value.clone()] })
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


    setCacheRotateZ () {
        var pointerRect = this.refs.$handle.rect();
        var targetRect = this.refs.$rotateZ.rect();
        this.rotateZCenter = {
            x: targetRect.x + targetRect.width/2, 
            y: targetRect.y + targetRect.height/2
        }
        this.rotateZStart = {
            x: pointerRect.x + pointerRect.width/2, 
            y: pointerRect.y + pointerRect.height/2 
        }

        this.setCacheBaseTrasnform('rotateZ', 'rotate');
    }    


    [EVENT('refreshSelection', 'refreshRect')] () {
        console.log('aaa')
        this.refresh();
    }
}