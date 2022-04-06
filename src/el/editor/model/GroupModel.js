import { MovableModel } from "./MovableModel";
import { AlignContent, AlignItems, Constraints, ConstraintsDirection, FlexDirection, FlexWrap, JustifyContent, Layout, ResizingMode } from 'el/editor/types/model';
import DefaultLayoutEngine from "../layout-engine/DefaultLayoutEngine";


const LayoutEngine = {
    [Layout.DEFAULT]: DefaultLayoutEngine
}

export class GroupModel extends MovableModel {

    getDefaultObject(obj = {}) {
        return super.getDefaultObject({
            'layout': Layout.DEFAULT,
            'constraints-horizontal': Constraints.NONE,
            'constraints-vertical': Constraints.NONE,
            // flex
            'flex-direction': FlexDirection.ROW,
            'flex-wrap': FlexWrap.NOWRAP,
            'justify-content': JustifyContent.FLEX_START,
            'align-items': AlignItems.FLEX_START,
            'align-content': AlignContent.FLEX_START,
            'order': 0,
            'flex-grow': 0,
            'flex-shrink': 0,
            'flex-basis': 'auto',       // 항목의 크기를 기본 크기(원래 가지고 있는 크기)로 정함             
            'gap': 0,
            resizingHorizontal: ResizingMode.FIXED,
            resizingVertical: ResizingMode.FIXED,
            // grid
            'grid-template-rows': 'auto',
            'grid-column-gap': '0px',
            'grid-template-columns': 'auto',
            'grid-row-gap': '0px',            
            'grid-template-areas': '',
            'grid-auto-rows': 'auto',
            'grid-auto-columns': 'auto',
            'grid-auto-flow': 'row',
            ...obj,
        })
    }


    get layout() {
        return this.json.layout;
    }

    isLayoutItem() {
        return !!this.parent?.hasLayout();
    }

    /**
     * default layout 이고 constrains 값을 가지고 있으면 
     * 
     * @returns {boolean}
     */
    hasConstraints() {
        return this.isLayout(Layout.DEFAULT);
    }

    /**
     * 
     * 레이아웃을 가지고 있는 container 인지 판별
     * 
     * @returns {boolean}
     */
    hasLayout() {
        return !this.hasConstraints() || Boolean(this.json.layout) === false;
    }

    /**
     * layout 체크 
     * 
     * @param {default|flex|grid} layout 
     * @returns {boolean}
     */
    isLayout(layout) {
        return this.json.layout === layout;
    }

    isInDefault() {
        const parentLayout = this.parent?.layout || 'default';

        return Layout.DEFAULT === parentLayout;
    }

    isInGrid() {
        return this.isInLayout(Layout.GRID);
    }

    isInFlex() {
        return this.isInLayout(Layout.FLEX);
    }

    isInLayout(layout) {
        if (!this.isLayoutItem()) return false;

        return this.parent.layout === layout;
    }

    reset(obj) {
        const isChanged = super.reset(obj);


        return isChanged;
    }

    changeConstraints(direction, value, shiftKey = false) {

        const h = this.json[direction];
        let newConstraints = value;

        if (h === Constraints.MAX) {

            if (value === Constraints.MAX) {
                newConstraints = Constraints.SCALE;
            } if (shiftKey && value === Constraints.MIN) {
                newConstraints = Constraints.STRETCH
            }
        } else if (h === Constraints.MIN) {
            if (value === Constraints.MIN) {
                newConstraints = Constraints.SCALE;
            } else if (shiftKey && value === Constraints.MAX) {
                newConstraints = Constraints.STRETCH;
            }
        } else if (h === Constraints.STRETCH) {
            if (value === Constraints.MIN) {
                newConstraints = Constraints.MAX;
            } else if (value === Constraints.MAX) {
                newConstraints = Constraints.MIN;
            }
        }

        this.reset({
            [direction]: newConstraints
        })

    }


    startToCacheChildren() {


        LayoutEngine[this.layout]?.startCache(this);
    }

    /**
     * 상위 레이어에 맞게 자식 레이어의 공간(x,y,width,height)를 변경한다.
     */
    recoverChildren() {
        LayoutEngine[this.layout]?.recover(this);
    }
}