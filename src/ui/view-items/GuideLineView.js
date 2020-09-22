import UIElement, { EVENT } from "@core/UIElement";
import { isNotUndefined, OBJECT_TO_PROPERTY } from "@core/functions/func";
import { BIND } from "@core/Event";


const text = (x, y, text = '', className = 'base-line') => {
    return /*html*/`<text x="${x}" y="${y}" class='${className}'>${text}</text>`
}

const line = (x1, y1, x2, y2, className = 'base-line') => {
    return /*html*/`<line ${OBJECT_TO_PROPERTY({x1, y1, x2, y2 })} class='${className}' />`
}

const hasLine = (images, line) => {
    return images.includes(line);
}

const addLine = (images, line) => {
    if (!hasLine(images, line)) {
        images.push(line);
    }
}

const hLine = (images, startX, minY, maxY) => {

    if (Math.abs(minY - maxY) === 0) return; 

    startX = Math.floor(startX)
    // top 
    addLine(images, line(startX-2,   minY,             startX+2,    minY))
    addLine(images, line(startX,     minY,             startX,      maxY)) 
    addLine(images, line(startX-2,   maxY,             startX+2,    maxY))

    /* text */ 
    var centerY  = (maxY + minY)/2;
    var centerHeight = Math.floor(Math.abs(maxY - minY))                
    addLine(images, text(startX+2, centerY, centerHeight))
}

const vLine = (images, startY, minX, maxX) => {

    if (Math.abs(minX - maxX) === 0) return; 

    startY = Math.floor(startY)

    // top 
    addLine(images, line(minX, startY-2,  minX,  startY+2))
    addLine(images, line(minX, startY,  maxX,   startY)) 
    addLine(images, line(maxX, startY-2, maxX,   startY+2))

    /* text */ 
    var centerX  = (maxX + minX)/2;
    var centerWidth = Math.floor(Math.abs(maxX - minX))                
    addLine(images, text(centerX, startY - 2, centerWidth, 'text-center'))
}

/**
 * 객체와의 거리의 가이드 라인을 그려주는 컴포넌트
 */
export default class GuideLineView extends UIElement {

    template() {
        return /*html*/`<svg class='guide-line-view' width="100%" height="100%" ></svg>`
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

        // 가이드 라인은 하나만 지원하는걸로 하자.
        list = list.filter((_, index) => index === 0);

        list.forEach(it => {
    
            var target = it.B; 
    
            if (isNotUndefined(it.ax)) {  // 세로 가이드 정의  (x축 좌표 찾기)

                var minY = Math.min(target.y, it.A.y);
                var maxY = Math.max(target.y + target.height, it.A.y + it.A.height);


                // it.bx : x 좌표 
                // minY : container 위치 
                // maxY : container 위치 
                // it.A.screenY : 객체 위치 
                // it.A.screenY2 : 객체 위치 
                var startX = it.bx; 

                if (it.A.y > it.B.y + it.B.height) {
                    hLine(images, startX, it.B.y + it.B.height, it.A.y);
                } else {
                    hLine(images, startX, minY, it.A.y);
                }

                if (it.A.x - target.x > 0 
                    && it.A.y <= (target.y + target.height)
                    && it.A.y >= target.y
                ) {
                    var centerY = it.A.y + it.A.height /2;                    
                    vLine(images, centerY, target.x, it.A.x);
                }

                if ((target.x + target.width) - (it.A.x + it.A.width) > 0
                    && it.A.y <= (it.B.y + it.B.height)
                    && it.A.y >= it.B.y 
                ) {
                    var centerY = it.A.y + it.A.height/2;
                    vLine(images, centerY, it.A.x + it.A.width, target.x + target.width);
                }                

                if ((it.A.y + it.A.height) < it.B.y) {
                    hLine(images, startX, it.A.y + it.A.height, it.B.y);
                } else {
                    hLine(images, startX, (it.A.y + it.A.height), maxY);
                }
    
            } else {            // 가로 가이드 정의 ( y 축 좌표 찾기 )
                
                var maxX = Math.max(target.x + target.width, it.A.x + it.A.width);

                var startY = it.by; 
    

                if (it.A.x > (it.B.x + it.B.width)) {
                    vLine(images, startY, (it.B.x + it.B.width), it.A.x);
                } else {
                    vLine(images, startY, it.A.x, it.B.x);
                }



                if (it.A.y - target.y > 0
                    && it.A.x <= (it.B.x + it.B.width) 
                    && it.A.x >= it.B.x 
                ) {
                    var centerX = (it.A.x + (it.A.x + it.A.width)) /2;
                    hLine(images, centerX, it.B.y, it.A.y);
                }

                if ((target.y + target.height) - (it.A.y + it.A.height) > 0
                    && it.A.x <= (it.B.x + it.B.width) 
                    && it.A.x >= it.B.x 
                ) {
                    var centerX = (it.A.x + (it.A.x + it.A.width)) /2;
                    hLine(images, centerX, (it.A.y + it.A.height), (it.B.y + it.B.height));
                }                

                
                if ((it.A.x + it.A.width) < it.B.x) {
                    vLine(images, startY, (it.A.x + it.A.width), it.B.x);
                } else {
                    vLine(images, startY, (it.A.x + it.A.width), maxX);
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
    }

    [EVENT('removeGuideLine')] () {
        this.removeGuideLine()
    }

    [EVENT('refreshGuideLine')] (list) {
        this.setGuideLine(list);
    }
} 