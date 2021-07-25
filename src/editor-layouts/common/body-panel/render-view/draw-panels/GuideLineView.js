
import { BIND, SUBSCRIBE } from "el/base/Event";
import { toRectVerties, vertiesToRectangle } from "el/base/functions/collision";
import { makeGuidePoint } from "el/base/functions/math";
import PathStringManager from "el/editor/parser/PathStringManager";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { vec3 } from "gl-matrix";

import './GuideLineView.scss';

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

const rect = (rectVerties) => {

    return /*html*/`
    <path 
        class="base-rect"
        fill="none"
        stroke-width="1"
        stroke="red"
        stroke-dasharray="2 2"
        d="${PathStringManager.makeRect(
            rectVerties[0][0],
            rectVerties[0][1],
            vec3.dist(rectVerties[0], rectVerties[1]),
            vec3.dist(rectVerties[0], rectVerties[3]),
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
            <svg class='elf--guide-line-view' ref="$guide" width="100%" height="100%" ></svg>
            `

    }

    initState() {
        return {
            list: []
        }
    }

    [BIND('$guide')]() {
        return {
            svgDiff: /*html*/`<g>${this.createGuideLine(this.state.list)}</g>`
        }
    }

    createGuideLine(list) {

        var images = []
        var texts = []
        list = list.filter(Boolean);
        for (var i = 0, len = list.length; i < len; i++) {

            const [source, target, axis, dist, newTarget, sourceVerties, targetVerties, isInvert] = list[i];
            const localDist = Math.floor(dist);            

            // 시작점 기준으로 맞출때가 필요하면 localSourceVertex 를 활용하자. 아직은 없음. 
            const localSourceVertex = this.$viewport.applyVertex(source);
            const localTargetVertex = this.$viewport.applyVertex(target);
            
            let localNewTargetVertex

            if (newTarget) {
                localNewTargetVertex = this.$viewport.applyVerties([newTarget])[0];
            }


            if (axis === 'x') {
                if (localDist > 0) {
                    images.push(line(localSourceVertex, localTargetVertex, 'dash-line'))      
                }

                if (localNewTargetVertex) {
                    images.push(line(localTargetVertex, localNewTargetVertex, 'dash-line'))
                }

                if (localDist > 0) {
                    texts.push(
                        text(
                            localDist,
                            vec3.lerp([], localSourceVertex, localTargetVertex, 0.5)
                        )
                    );
                }

            }

            if (axis === 'y') {
                if (localDist > 0) {
                    images.push(line(localSourceVertex, localTargetVertex, 'dash-line'))                                   
                }

                if (localNewTargetVertex) {
                    images.push(line(localTargetVertex, localNewTargetVertex, 'dash-line'))

                }

                if (localDist > 0) {
                    texts.push(
                        text(
                            localDist,
                            vec3.add([], vec3.lerp([], localSourceVertex, localTargetVertex, 0.5), [20, 0, 0]),
                        )
                    );
                }
            }


            if (axis === 'x') {
                images.push(hLineByPoint(localTargetVertex, localSourceVertex))
            }            

            if (axis === 'y') {
                images.push(vLineByPoint(localTargetVertex, localSourceVertex))
            }

            if (this.state.hasVerties) {
                images.push(point(localSourceVertex,3, 'vertex'))
                images.push(point(localTargetVertex,3, 'vertex'))                
            }            

            if (sourceVerties) {
                if ((this.$selection.isOne && this.$editor.isPointerDown) || (this.$selection.isMany && !this.$editor.isPointerMove)) {
                    images.push(rect(this.$viewport.applyVerties(sourceVerties)))
                }
            }

            if (targetVerties) {
                images.push(rect(this.$viewport.applyVerties(targetVerties)))
            }
        }



        return [...images, ...texts].join('');
    }

    removeGuideLine() {
        this.setState({
            list: []
        })
    }

    setGuideLine(list, hasVerties = false) {
        this.setState({
            list,
            hasVerties
        })
    }

    [SUBSCRIBE('removeGuideLine', 'refreshSelection')]() {
        this.removeGuideLine()
    }

    [SUBSCRIBE('refreshGuideLineByTarget')](targetVertiesList = []) {
        return this.refreshSmartGuides(targetVertiesList);
    }

    [SUBSCRIBE('updateViewport')]() {
        this.refresh();
    }


    refreshSmartGuides (targetVertiesList) {

        if (this.$selection.isEmpty) return;

        const sourceVerties = toRectVerties(this.$selection.verties); 
        let targetList;
        if (targetVertiesList) {
            targetList = targetVertiesList.map(it => toRectVerties(it));
        } else {
            const targets = this.$selection.snapTargetLayers.map(target => {
                const rectVerties = toRectVerties(target.verties);
                return {targetVerties: rectVerties, dist: vec3.dist(rectVerties[4], sourceVerties[4])};
            })
    
            targets.sort((a, b) => {
                return a.dist - b.dist
            })

            targetList = targets.map(target => target.targetVerties);
        }


        // 스마트 가이드는 총 3가지 기능에 대한 것을 함 
        // 1. A가 B의 완전 포함 관계에 있을 때, A의 각 변은 B 의 각 변에 대응, 즉 4가지 상태에 대한 길이만 정리해주면 됨 
        // 2. A가 B의 특정 부분에 포함 되어 있을 때 , A 와 B의 충돌지점을 찾아서  전체영역에 대비스 4가지 상태의 대한 길이를 정해해주면 됨  
        // 3. A와 B가 충돌되지 않았을 때는 원래 하던대로 표시 

        // x축 가이드 설정하기 
        const xList = targetList.map(targetVerties => makeGuidePoint(sourceVerties, targetVerties));

        xList.sort((a, b) => {
            return a[3] - b[3];
        });

        const list = [xList[0], xList[1]].filter(Boolean);

        this.setGuideLine(list);             

    }

    refreshSmartGuidesForVerties() {
        const guides = this.$snapManager.findGuide(this.$selection.verties);

        this.setGuideLine(guides, true);             
    }

    [SUBSCRIBE('refreshSelectionStyleView')]() {

        const expect = this.$selection.hasChangedField('d', 'clip-path')

        if (!expect && this.$selection.hasChangedField('x', 'y', 'width', 'height', 'transform', 'transform-origin')) {
            this.refreshSmartGuidesForVerties();
        }
    }
}