import UIElement, { EVENT } from "../../../util/UIElement";
import { isNotUndefined, OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { Length } from "../../../editor/unit/Length";
import { BIND } from "../../../util/Event";


const text = (x, y, text = '', className = 'base-line') => {
    return /*html*/`<text x="${x}" y="${y}" class='${className}'>${text}</text>`
}

const line = (x1, y1, x2, y2, className = 'base-line') => {
    return /*html*/`<line ${OBJECT_TO_PROPERTY({x1, y1, x2, y2 })} class='${className}' />`
}

const hLine = (images, startX, minY, maxY) => {

    if (Math.abs(minY - maxY) === 0) return; 

    startX = Math.floor(startX)
    // top 
    images.push(line(startX-2,   minY,             startX+2,    minY))
    images.push(line(startX,     minY,             startX,      maxY)) 
    images.push(line(startX-2,   maxY,             startX+2,    maxY))

    /* text */ 
    var centerY  = (maxY + minY)/2;
    var centerHeight = Math.floor(Math.abs(maxY - minY))                
    images.push(text(startX+2, centerY, centerHeight))
}

const vLine = (images, startY, minX, maxX) => {

    if (Math.abs(minX - maxX) === 0) return; 

    startY = Math.floor(startY)

    // top 
    images.push(line(minX, startY-2,  minX,  startY+2))
    images.push(line(minX, startY,  maxX,   startY)) 
    images.push(line(maxX, startY-2, maxX,   startY+2))

    /* text */ 
    var centerX  = (maxX + minX)/2;
    var centerWidth = Math.floor(Math.abs(maxX - minX))                
    images.push(text(centerX, startY - 2, centerWidth, 'text-center'))
}

/**
 * 객체와의 거리의 가이드 라인을 그려주는 컴포넌트
 */
export default class GuideLineView extends UIElement {

    template() {
        return `<svg class='guide-line-view' width="100%" height="100%" ></svg>`
    }

    initState() {
        return {
            list: []
        }
    }

    [BIND('$el')] () {
        return {
            html: this.createGuideLine(this.state.list)
        }
    }
    
    createGuideLine (list) {
    
        var images = []

        list.forEach(it => {
    
            var target = it.B; 
    
            if (isNotUndefined(it.ax)) {  // 세로 가이드 정의  (x축 좌표 찾기)

                var minY = Length.min(target.screenY, it.A.screenY);
                var maxY = Length.max(target.screenY2, it.A.screenY2);


                // it.bx : x 좌표 
                // minY : container 위치 
                // maxY : container 위치 
                // it.A.screenY : 객체 위치 
                // it.A.screenY2 : 객체 위치 
                var startX = it.bx; 

                if (it.A.screenY.value > it.B.screenY2.value) {
                    hLine(images, startX, it.B.screenY2.value, it.A.screenY.value);
                } else {
                    hLine(images, startX, minY.value, it.A.screenY.value);
                }

                if (it.A.screenX.value - target.screenX.value > 0 
                    && it.A.screenY.value <= it.B.screenY2.value 
                    && it.A.screenY.value >= it.B.screenY.value 
                ) {
                    var centerY = (it.A.screenY.value + it.A.screenY2.value) /2;                    
                    vLine(images, centerY, target.screenX.value, it.A.screenX.value);
                }

                if (target.screenX2.value - it.A.screenX2.value > 0
                    && it.A.screenY.value <= it.B.screenY2.value 
                    && it.A.screenY.value >= it.B.screenY.value 
                ) {
                    var centerY = (it.A.screenY.value + it.A.screenY2.value) /2;
                    vLine(images, centerY, it.A.screenX2.value, target.screenX2.value);
                }                

                if (it.A.screenY2.value < it.B.screenY.value) {
                    hLine(images, startX, it.A.screenY2.value, it.B.screenY.value);
                } else {
                    hLine(images, startX, it.A.screenY2.value, maxY.value);
                }
    
            } else {            // 가로 가이드 정의 
                
                var maxX = Length.max(target.screenX2, it.A.screenX2);

                var startY = it.by; 
    

                if (it.A.screenX.value > it.B.screenX2.value) {
                    vLine(images, startY, it.B.screenX2.value, it.A.screenX.value);
                } else {
                    vLine(images, startY, it.A.screenX2.value, it.B.screenX.value);
                }



                if (it.A.screenY.value - target.screenY.value > 0
                    && it.A.screenX.value <= it.B.screenX2.value 
                    && it.A.screenX.value >= it.B.screenX.value 
                ) {
                    var centerX = (it.A.screenX.value + it.A.screenX2.value) /2;
                    hLine(images, centerX, it.B.screenY.value, it.A.screenY.value);
                }

                if (target.screenY2.value - it.A.screenY2.value > 0
                    && it.A.screenX.value <= it.B.screenX2.value 
                    && it.A.screenX.value >= it.B.screenX.value 
                ) {
                    var centerX = (it.A.screenX.value + it.A.screenX2.value) /2;
                    hLine(images, centerX, it.A.screenY2.value, it.B.screenY2.value);
                }                

                
                if (it.A.screenX2.value < it.B.screenX.value) {
                    vLine(images, startY, it.A.screenX2.value, it.B.screenX.value);
                } else {
                    vLine(images, startY, it.A.screenX2.value, maxX.value);
                }
            }
    
        })
    
    
        return images.join('');
    }

    removeGuideLine() {
        this.setState({
            list: []
        }) 
    }

    setGuideLine (list) {
        this.setState({
            list
        })
        // this.$el.cssText(CSS_TO_STRING(this.createGuideLine(list)));
    }

    [EVENT('removeGuideLine')] () {
        this.removeGuideLine()
    }

    [EVENT('refreshGuideLine')] (list) {
        this.setGuideLine(list);
    }
} 