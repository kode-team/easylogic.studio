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
        this.$selection.setRectCache();         

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
        this.$selection.setRectCache();
        this.bindData('$rotateContainer');   
        this.emit('refreshSelectionStyleView', null, false, true)       
        this.emit('refreshRect');        
    }

    [POINTERSTART('$rotateArea') + MOVE('moveRotateXY') + END('moveEndRotateXY')] () {
        // this.setCacheRotateXY () 


        this.state.rotateCache = this.$selection.map(item => {
            return {
                item,
                rotateX: Transform.get(item['transform'], 'rotateX')[0] || Length.deg(0),
                rotateY: Transform.get(item['transform'], 'rotateY')[0] || Length.deg(0),
            }
        })
    }

    moveRotateXY (dx, dy) {
        var rx = Length.deg(-dy)
        var ry = Length.deg(dx)


        this.state.rotateCache.forEach(cache => {

            let transform = cache.item.transform
            transform = Transform.rotateX(transform, Length.deg(cache.rotateX.value + rx.value)) 
            transform = Transform.rotateY(transform, Length.deg(cache.rotateY.value + ry.value)) 

            cache.item.transform = transform;
        })

        this.bindData('$rotateContainer');

        this.emit('refreshSelectionStyleView', null, false, true)
        this.emit('refreshRect');        

    }

    moveEndRotateXY (dx, dy) {    
        this.emit('refreshSelectionStyleView')
        this.emit('refreshRect');     
        this.$selection.setRectCache();           
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
        this.state.rotateCache = this.$selection.map(item => {
            return {
                item,
                rotateZ: Transform.get(item['transform'], 'rotateZ')[0] || Length.deg(0),
            }
        })
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
        this.$selection.setRectCache();              
    }


    modifyRotateZ(dx, dy) {
        var e = this.$config.get('bodyEvent');
        var distAngle = Length.deg(Math.floor(calculateAnglePointDistance(
            this.rotateZStart,
            this.rotateZCenter,
            {dx, dy}
        )));

        this.state.rotateCache.forEach(cache => {

            let transform = cache.item.transform
            transform = Transform.rotateZ(transform, Length.deg(cache.rotateZ.value + distAngle.value)) 

            cache.item.transform = transform;
        })

    }

    [EVENT('refreshSelection')] () {
        this.refresh();
    }
}