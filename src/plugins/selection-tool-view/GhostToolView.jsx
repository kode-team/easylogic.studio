import { FlexDirection, Layout } from "el/editor/types/model";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { DOMDIFF, LOAD, SUBSCRIBE } from "el/sapa/Event";
import { clone } from "el/sapa/functions/func";
import { rectToVerties, toRectVerties, vertiesToRectangle } from "el/utils/collision";
import { vertiesMap } from "el/utils/math";
import { mat4, vec3 } from "gl-matrix";

import './GhostToolView.scss';

const CHECK_RATE = 0.5; 


/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class GhostToolView extends EditorElement {

    template() {
        return <div class='elf--ghost-tool-view' >
                <div ref="$containerView"></div>
                <div ref="$view"></div>
            </div>
    }

    [SUBSCRIBE('startGhostToolView')] (verties) {

        const screenVerties = this.$selection.targetVerties;

        this.verties = clone(screenVerties);
        this.ghostVerties = clone(screenVerties);
        this.ghostScreenVerties = this.$viewport.applyVerties(this.ghostVerties);
        this.initMousePoint = this.$viewport.getWorldPosition();
    }

    [SUBSCRIBE('moveFirstGhostToolView')] () {
        const targetMousePoint = this.$viewport.getWorldPosition();

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        // translate 
        this.ghostVerties = this.verties.map(v => {
            return vec3.add([], v, newDist);
        });

        this.load('$containerView');
    }

    [SUBSCRIBE('moveGhostToolView')] () {
        const targetMousePoint = this.$viewport.getWorldPosition();

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        // translate 
        this.ghostVerties = this.verties.map(v => {
            return vec3.add([], v, newDist);
        });

        this.ghostScreenVerties = this.$viewport.applyVerties(this.ghostVerties);

        const filteredLayers = this.$selection.filteredLayers.filter(it => this.$selection.check(it) === false);
        this.containerList = filteredLayers.filter(it => it.hasLayout() || it.is('artboard')).map(it => it.originVerties);        
        this.targetItem = filteredLayers[0];

        if (this.targetItem) {
            this.targetOriginPosition = this.$viewport.applyVerties(
                toRectVerties(this.targetItem.originVerties)
            );
            this.targetPoint = this.$viewport.applyVertex(targetMousePoint);

            this.targetRelativeMousePoint = {
                x: (this.targetPoint[0] - this.targetOriginPosition[0][0]) / (this.targetOriginPosition[1][0] - this.targetOriginPosition[0][0]),
                y: (this.targetPoint[1] - this.targetOriginPosition[0][1]) / (this.targetOriginPosition[3][1] - this.targetOriginPosition[0][1])
            }

            if (this.targetItem.isLayoutItem()) {
                this.targetParent = this.targetItem.parent;

                if (this.targetParent) {
                    this.targetParentPosition = this.$viewport.applyVerties(this.targetParent.originVerties);
                }
            } else {
                this.targetParent = null;
                this.targetParentPosition = null;
            }
        } else {
            this.targetPoint = null;
            this.targetRelativeMousePoint = null;
            this.targetParent = null;
            this.targetParentPosition = null;            
        }

        this.load('$view');
    }

    [LOAD('$containerView')] () {

        if (!this.ghostVerties) {
            return <svg></svg>
        }

        return <svg>
            {this.containerList.map(it => {
                it = this.$viewport.applyVerties(it);
                return <path class="container" d={`
                    M ${it[0][0]} ${it[0][1]}
                    L ${it[1][0]} ${it[1][1]}
                    L ${it[2][0]} ${it[2][1]}
                    L ${it[3][0]} ${it[3][1]}
                    Z
                `} />
            })}
        </svg>
        
    }

    renderPath (verties, className, data = className) {
        verties = toRectVerties(verties);

        const textX = className === 'flex-item' ? verties[0][0] : verties[0][0];
        const textY = className === 'flex-item' ? verties[2][1] + 10 : verties[0][1] - 10;

        return <>
            <text x={textX} y={textY} font-size={8}>{data}</text>
            <path class={className} d={`
                M ${verties[0][0]} ${verties[0][1]}
                L ${verties[1][0]} ${verties[1][1]}
                L ${verties[2][0]} ${verties[2][1]}
                L ${verties[3][0]} ${verties[3][1]}
                Z
            `} />
        </>
    }

    renderLayoutFlexRowArea () {
        const rect = vertiesToRectangle(this.targetOriginPosition);

        if (this.targetRelativeMousePoint.x < CHECK_RATE) {

            return this.renderPath([
                [this.targetOriginPosition[0][0], this.targetOriginPosition[0][1]],
                [this.targetOriginPosition[0][0] + rect.width/2, this.targetOriginPosition[1][1]],
                [this.targetOriginPosition[0][0] + rect.width/2, this.targetOriginPosition[2][1]],
                [this.targetOriginPosition[3][0], this.targetOriginPosition[3][1]]
            ], 'flex-item', 'flex-left');
        } else {
            return this.renderPath([
                [this.targetOriginPosition[0][0] + rect.width/2, this.targetOriginPosition[0][1]],
                [this.targetOriginPosition[1][0], this.targetOriginPosition[1][1]],
                [this.targetOriginPosition[2][0], this.targetOriginPosition[2][1]],
                [this.targetOriginPosition[3][0] + rect.width/2, this.targetOriginPosition[3][1]]
            ], 'flex-item', 'flex-right');
        }
    }

    renderLayoutFlexColumnArea () {
        const rect = vertiesToRectangle(this.targetOriginPosition);        
        if (this.targetRelativeMousePoint.y < CHECK_RATE) {

            return this.renderPath([
                [this.targetOriginPosition[0][0], this.targetOriginPosition[0][1]],
                [this.targetOriginPosition[1][0], this.targetOriginPosition[1][1]],
                [this.targetOriginPosition[2][0], this.targetOriginPosition[2][1] - rect.height/2],
                [this.targetOriginPosition[3][0], this.targetOriginPosition[3][1] - rect.height/2]
            ], 'flex-item', 'flex-top');
        } else {
            return this.renderPath([
                [this.targetOriginPosition[0][0], this.targetOriginPosition[0][1] + rect.height/2],
                [this.targetOriginPosition[1][0], this.targetOriginPosition[1][1] + rect.height/2],
                [this.targetOriginPosition[2][0], this.targetOriginPosition[2][1]],
                [this.targetOriginPosition[3][0], this.targetOriginPosition[3][1]]
            ], 'flex-item', 'flex-bottom');
        }
    }

    renderLayoutItemInsertArea () {

        // 현재 선택된 layer 의 부모를 가지고 온다. 

        if (!this.targetParent) return "";

        console.log('this.targetparent', this.targetParent);

        if (this.targetParent.hasLayout()) {
            if (this.targetParent.isLayout(Layout.FLEX)) {

                switch(this.targetParent['flex-direction']) {
                case FlexDirection.ROW:
                    return this.renderLayoutFlexRowArea();
                case FlexDirection.COLUMN:
                    return this.renderLayoutFlexColumnArea();
                }

            } else if (this.targetParent.isLayout(Layout.GRID)) {

            }
        }

        return <path class="insert-area" d={`

        `} />
    }

    [LOAD('$view') + DOMDIFF] () {

        if (!this.ghostVerties) {
            return <svg></svg>
        }

        return <svg>

            {this.targetParent && this.renderPath(this.targetParentPosition, "target-parent")}
            {this.targetItem && this.renderPath(this.targetOriginPosition, "target")}
            {this.targetItem && this.renderPath(this.targetOriginPosition, "target-rect")}
            {this.targetItem && this.renderLayoutItemInsertArea()}


            {this.renderPath(this.ghostScreenVerties, "ghost")}
        </svg>
    }

    initializeGhostView() {
        this.ghostVerties = null;
        this.ghostScreenVerties = null;

        this.targetOriginPosition = null;
        this.targetOriginPosition = null;

        this.targetRelativeMousePoint = null;

        this.targetParent = null;
        this.targetParentPosition = null;
    }

    [SUBSCRIBE('endGhostToolView')] () {
        this.initializeGhostView();
        this.load();
    }
}