export default class SegmentManager {
    constructor () {
        this.segmentList = [] 
    }

    reset () {
        this.segmentList = []
        return this;         
    }


    addLine (a, b) {
        this.segmentList.push({
            line: true,
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y            
        })
        return this;         
    }

    addGuideLine (a, b) {
        this.segmentList.push({
            line: true,
            guide: true, 
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y            
        })
        return this;         
    }    

    addPoint(obj, point, index, segment) {
        this.segmentList.push({
            ...obj,
            cx: point.x,
            cy: point.y,
            index,
            segment,
            isFirst: point.isFirst,
            isLast: point.isLast,
            isSecond: point.isSecond

        })

        return this; 
    }


    addStartPoint(obj, point) {
        this.segmentList.push({
            ...obj,
            cx: point.x,
            cy: point.y,
            start: true 
        })

        return this; 
    }    

    addCurvePoint (point, index, segment) {

        this.segmentList.push({
            curve: true, 
            cx: point.x,
            cy: point.y,
            index,
            segment,
            isFirst: point.isFirst,
            isLast: point.isLast,
            isSecond: point.isSecond
        })     

        return this; 
    }

    toString () {

        this.segmentList.sort((a, b) => {
            if (a.line && !b.line) {
                return -1; 
            } else if (!a.line && b.line) {
                return 1; 
            }
            return 0;
        })

        return this.segmentList.map(it => {

            if (it.line) {
                return  `
                <line stroke-width='1' 
                    data-segment="true"
                    data-is-last="${it.isLast}"                
                    data-guide='${it.guide}'
                    x1='${it.x1}' x2='${it.x2}' y1='${it.y1}' y2='${it.y2}' 
                />`
            } else if (it.curve) {
                return /*html*/`
                <circle 
                    cx='${it.cx}' 
                    cy='${it.cy}' 
                    r='4'                     
                    class='curve' 
                    data-is-last="${it.isLast}"                
                    data-is-first="${it.isFirst}"      
                    data-is-second="${it.isSecond}"                                  
                    title="${it.segment} curve"                
                    data-index='${it.index}' 
                    data-segment-point='${it.segment}' 
                    data-segment="true" 
                />`
            } else if (it.start) {
                return `
                <circle 
                    cx='${it.cx}' 
                    cy='${it.cy}' 
                    r='4'                     
                    title="Center"
                    data-start="true" 
                />`                  
            } else {
                return /*html*/`
                <circle 
                    cx='${it.cx}' 
                    cy='${it.cy}' 
                    r='4'                     
                    title="${it.segment}"
                    data-is-last="${it.isLast}"
                    data-is-first="${it.isFirst}"
                    data-is-second="${it.isSecond}"
                    data-index='${it.index}' 
                    data-segment-point='${it.segment}' 
                    data-segment="true" 
                />`  
            }

        }).join('');
    }

}

