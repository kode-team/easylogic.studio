import UIElement, { EVENT } from "@core/UIElement";
import { OBJECT_TO_PROPERTY } from "@core/functions/func";
import { BIND } from "@core/Event";
import { vec3 } from "gl-matrix";

const line = (source, target, className = 'base-line') => {
    return /*html*/`<line ${OBJECT_TO_PROPERTY({
        x1: source[0], 
        y1: source[1], 
        x2: target[0], 
        y2: target[1] 
    })} class='${className}' />`
}


const hLine = (target) => {

    return line([target[0], 0, 0], [target[0], 10000, 0]);
}

const vLine = (target) => {

    return line([0, target[1], 0], [10000, target[1], 0]);
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

        list.forEach(it => {
            
            const [source, target, axis] = it;

            const localSourceVertext = vec3.transformMat4([], source, this.$viewport.matrix);
            const localTargetVertext = vec3.transformMat4([], target, this.$viewport.matrix);            

            if (axis === 'x') {
                images.push(hLine(localTargetVertext))
            } 
            
            if (axis === 'y') {
                images.push(vLine(localTargetVertext))
            }


        })
    
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
} 