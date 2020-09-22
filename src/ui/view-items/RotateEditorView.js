import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, MOVE, END, DOUBLECLICK, BIND, CLICK } from "@core/Event";
import { Length } from "@unit/Length";
import { Transform } from "@property-parser/Transform";
import { calculateAnglePointDistance } from "@core/functions/math";
import icon from "@icon/icon";

const directions = [
    'top-left',
    'top',
    'top-right',
    'left',
    'right',
    'bottom-left',
    'bottom',
    'bottom-right'
]


const DEFINED_ANGLES = {
    "top": "0",
    "top-right": "45",
    "right": "90",
    "bottom-right": "135",
    "bottom": "180",
    "bottom-left": "225",
    "left": "270",
    "top-left": "315"
  };

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
                <div class='direction-area' ref='$directionArea'>
                    ${directions.map(it => {
                        return /*html*/`<div class='direction' data-value='${it}'></div>`
                    }).join('')}
                </div>                
                <div class='rotate-z' ref='$rotateZ'>
                    <div class='handle-line'></div>                
                    <div class='handle icon' ref='$handle'>${icon.gps_fixed}</div>
                </div>                
            </div>
        `
    }

    [CLICK('$directionArea .direction')] (e) {
        var direction = e.$dt.attr('data-value');
        var value = Length.deg(DEFINED_ANGLES[direction] || 0)
        this.$selection.each(item => {
            const transform = Transform.replace(item.transform, {  type: 'rotateZ', value: [value]})
            item.reset({ transform})
        })
                 
        this.bindData('$rotateZ')
        this.emit('refreshSelectionStyleView', null, false, true)
        this.emit('refreshRect');        

    }

    [BIND('$rotateContainer')] () {

        var current = this.$selection.current || {transform: ''};

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

        var current = this.$selection.current || {transform: ''};

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
        this.$selection.each(item => {
            item.reset({ transform: Transform.remove(item.transform, ['rotateX', 'rotateY']) })
        })
        this.bindData('$rotateContainer');   
        this.emit('refreshSelectionStyleView', null, false, true)       
        this.emit('refreshRect');        
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

        this.emit('refreshSelectionStyleView', null, false, true)
        this.emit('refreshRect');        

    }

    moveEndRotateXY (dx, dy) {    
        this.emit('refreshSelectionStyleView')
        this.emit('refreshRect');        
    }

    modifyCacheItem (item, cachedItem, tempValue, key, dt) {
        
        if (cachedItem[key]) { 
            tempValue.set(cachedItem[key].value[0].value);
        } 

        tempValue.add(dt);

        this.setTransformValue(item, key, tempValue);
    }    


    modifyRotateXY (dx, dy) {
        var rx = Length.deg(-dy / this.$editor.scale)
        var ry = Length.deg(dx / this.$editor.scale)

        this.$selection.each((item, cachedItem) => {

            this.modifyCacheItem(item, cachedItem, Length.deg(0), 'rotateX', rx)
            this.modifyCacheItem(item, cachedItem, Length.deg(0), 'rotateY', ry)

            item.transform = Transform.join(item.transformObj);
        })
    }

    [DOUBLECLICK('$handle')] () {
        this.$selection.each(item => {
            item.reset({ transform: Transform.remove(item.transform, ['rotateZ', 'rotate']) })
        })
        this.bindData('$rotateZ');               
        this.emit('refreshSelectionStyleView', null, false, true)     
        this.emit('refreshRect');           
    }

    [POINTERSTART('$handle') + MOVE() + END()] () {
        this.setCacheRotateZ();
    }

    move (dx, dy) {
        this.modifyRotateZ(dx, dy);

        this.bindData('$rotateZ');             
        this.emit('refreshSelectionStyleView', null, false, true)
        this.emit('refreshRect');

    }

    end () {
        this.emit('refreshSelectionStyleView')        
        this.emit('refreshRect');        
    }


    modifyRotateZ(dx, dy) {
        var e = this.$config.get('bodyEvent');
        var distAngle = Length.deg(Math.floor(calculateAnglePointDistance(
            this.rotateZStart,
            this.rotateZCenter,
            {dx, dy}
        )));

       
        this.$selection.each((item, cachedItem) => {
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
        this.$selection.each((item, cachedItem) => {
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


    [EVENT('refreshSelection')] () {
        this.refresh();
    }
}