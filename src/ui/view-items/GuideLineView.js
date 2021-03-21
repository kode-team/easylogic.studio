import UIElement, { EVENT } from "@core/UIElement";
import { BIND } from "@core/Event";
import { registElement } from "@core/registerElement";

const line = (source, target, className = 'base-line') => {
    return /*html*/`<line x1="${source[0]}" y1="${source[1]}" x2="${target[0]}" y2="${target[1]}" class='${className}' />`
}


const hLine = (target) => {

    return line([target[0], 0, 0], [target[0], 10000, 0]);
}

const vLine = (target) => {

    return line([0, target[1], 0], [10000, target[1], 0]);
}

const point = (target, dist = 3) => {

    return /*html*/`
        <path 
            stroke="red"
            stroke-width="1"
            d="
                M ${target[0]-dist} ${target[1]-dist}
                L ${target[0]+dist} ${target[1]+dist}
                M ${target[0]-dist} ${target[1]+dist}
                L ${target[0]+dist} ${target[1]-dist}
            " 
        />
    `;
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
        for(var i = 0, len = list.length; i< len; i++) {
        
            const [source, target, axis] = list[i];

            // 시작점 기준으로 맞출때가 필요하면 localSourceVertext 를 활용하자. 아직은 없음. 
            const localSourceVertext = this.$viewport.applyVerties([source])[0];
            const localTargetVertext = this.$viewport.applyVerties([target])[0];            

            if (axis === 'x') {
                images.push(hLine(localTargetVertext))        
                images.push(point([localTargetVertext[0], localSourceVertext[1], localSourceVertext[2]]))
            } 
            
            if (axis === 'y') {
                images.push(vLine(localTargetVertext))
                images.push(point([localSourceVertext[0], localTargetVertext[1], localSourceVertext[2]]))
            }

            // images.push(point(localSourceVertext))
            images.push(point(localTargetVertext))                
    
        }
    
        return [...new Set(images)].join('');
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

    [EVENT('updateViewport')] () {
        this.refresh();
    }
} 

registElement({ GuideLineView })