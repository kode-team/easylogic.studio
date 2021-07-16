
import { BIND, SUBSCRIBE } from "el/base/Event";
import PathStringManager from "el/editor/parser/PathStringManager";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { vec3 } from "gl-matrix";

const ARROW_SIZE = 4; 

const line = (source, target, className = 'base-line') => {
    return /*html*/`<line x1="${source[0]}" y1="${source[1]}" x2="${target[0]}" y2="${target[1]}" class='${className}' />`
}

const text = (t, target, className = 'base-line') => {
    const text = `${Math.floor(t)}`;
    const unitWidth = 13;
    const unitHeight = 16;
    const width = text.length * unitWidth;
    const height = unitHeight;

    return /*html*/`
    
        <rect x="${target[0] - width / 4}" y="${target[1] - unitHeight - 2}" width="${width}" height="${height}" rx="2" ry="2" fill="#00a9f4" />
        <text x="${target[0]}" y="${target[1]}" dy="-5" font-size="16">${text}</text>
    `
}


const hLineByPoint = (target, source) => {
    return line(target, source);
}

const vLineByPoint = (target, source) => {
    return line(target, source);
}

const rect = (verties) => {
    return /*html*/`
    <path 
        class="base-rect"
        fill="none"
        stroke-width="1"
        stroke="red"
        stroke-dasharray="2 2"
        d="${PathStringManager.makeRect(
            verties[0][0],
            verties[0][1],
            vec3.dist(verties[0], verties[1]),
            vec3.dist(verties[0], verties[3]),
        )}
        " 
    />
`;    
}

const point = (target, dist = 3, direction = 'left') => {

    if (direction === 'left') {

        return /*html*/`
        <path 
            class="arrow"
            d="
                M ${target[0] + dist} ${target[1] - dist}
                L ${target[0]} ${target[1]}
                L ${target[0] + dist} ${target[1] + dist}
            " 
        />
    `;
    }

    if (direction === 'right') {

        return /*html*/`
        <path 
            class="arrow"
            d="
                M ${target[0] - dist} ${target[1] - dist}
                L ${target[0]} ${target[1]}
                L ${target[0] - dist} ${target[1] + dist}
            " 
        />
    `;
    }

    if (direction === 'up') {

        return /*html*/`
        <path 
            class="arrow"
            d="
                M ${target[0] - dist} ${target[1] + dist}
                L ${target[0]} ${target[1]}
                L ${target[0] + dist} ${target[1] + dist}
            " 
        />
    `;
    } 
    

    if (direction === 'down') {

        return /*html*/`
        <path 
            class="arrow"
            d="
                M ${target[0] - dist} ${target[1] - dist}
                L ${target[0]} ${target[1]}
                L ${target[0] + dist} ${target[1] - dist}
            " 
        />
    `;
    }     

    return /*html*/`
        <path 
            stroke="red"
            stroke-width="1"
            d="
                M ${target[0] - dist} ${target[1] - dist}
                L ${target[0] + dist} ${target[1] + dist}
                M ${target[0] - dist} ${target[1] + dist}
                L ${target[0] + dist} ${target[1] - dist}
            " 
        />
    `;
}

/**
 * 객체와의 거리의 가이드 라인을 그려주는 컴포넌트
 */
export default class GuideLineView extends EditorElement {

    template() {
        return /*html*/`
            <svg class='guide-line-view' ref="$guide" width="100%" height="100%" ></svg>
            `

    }

    initState() {
        return {
            list: []
        }
    }

    [BIND('$guide')]() {
        return {
            html: this.createGuideLine(this.state.list)
        }
    }

    createGuideLine(list) {

        var images = []
        list = list.filter(Boolean);
        for (var i = 0, len = list.length; i < len; i++) {

            const [source, target, axis, dist, newTarget, sourceVerties, targetVerties, isInvert] = list[i];

            // 시작점 기준으로 맞출때가 필요하면 localSourceVertext 를 활용하자. 아직은 없음. 
            const localSourceVertext = this.$viewport.applyVerties([source])[0];
            const localTargetVertext = this.$viewport.applyVerties([target])[0];
            let localNewTargetVertext

            if (newTarget) {
                localNewTargetVertext = this.$viewport.applyVerties([newTarget])[0];
            }


            if (axis === 'x') {
                if (dist > 0) {

                    images.push(line(localSourceVertext, localTargetVertext, 'dash-line'))
                }

                if (localNewTargetVertext) {
                    images.push(line(localTargetVertext, localNewTargetVertext, 'dash-line'))
                }

                if (dist > 0) {
                    images.push(
                        text(
                            dist,
                            vec3.lerp([], localSourceVertext, localTargetVertext, 0.5)
                        )
                    );
                }

            }

            if (axis === 'y') {
                if (dist > 0) {

                    images.push(line(localSourceVertext, localTargetVertext, 'dash-line'))
                }

                if (localNewTargetVertext) {
                    images.push(line(localTargetVertext, localNewTargetVertext, 'dash-line'))
                }

                if (dist > 0) {
                    images.push(
                        text(
                            dist,
                            vec3.add([], vec3.lerp([], localSourceVertext, localTargetVertext, 0.5), [20, 0, 0]),
                        )
                    );
                }
            }


            if (axis === 'x') {
                images.push(hLineByPoint(localTargetVertext, localSourceVertext))
            }            

            if (axis === 'y') {
                images.push(vLineByPoint(localTargetVertext, localSourceVertext))
            }

            if (sourceVerties) {
                images.push(rect(this.$viewport.applyVerties(sourceVerties)))
            }

            if (targetVerties) {
                images.push(rect(this.$viewport.applyVerties(targetVerties)))
            }
        }

        return [...new Set(images)].join('');
    }

    removeGuideLine() {
        this.setState({
            list: []
        })
    }

    setGuideLine(list) {
        this.setState({
            list
        })
    }

    [SUBSCRIBE('removeGuideLine', 'refreshSelection')]() {
        this.removeGuideLine()
    }

    [SUBSCRIBE('refreshGuideLine')](list) {
        this.setGuideLine(list);
    }

    [SUBSCRIBE('updateViewport')]() {
        this.refresh();
    }
}