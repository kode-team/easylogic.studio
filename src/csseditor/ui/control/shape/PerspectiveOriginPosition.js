import UIElement, { EVENT } from '../../../../util/UIElement';
import { 
    CHANGE_EDITOR, 
    CHANGE_SELECTION, 
    CHANGE_ARTBOARD 
} from '../../../types/event';
import { EMPTY_STRING, POSITION_CENTER, POSITION_RIGHT, POSITION_TOP, POSITION_LEFT, POSITION_BOTTOM, WHITE_STRING } from '../../../../util/css/types';
import { POINTERSTART, DOUBLECLICK, MOVE } from '../../../../util/Event';
import { isString } from '../../../../util/functions/func';
import { Length, Position } from '../../../../editor/unit/Length';
import { editor } from '../../../../editor/editor';

const DEFINE_POSITIONS = { 
    [POSITION_CENTER]: [POSITION_CENTER, POSITION_CENTER],
    [POSITION_RIGHT]: [POSITION_RIGHT, POSITION_CENTER],
    [POSITION_TOP]: [POSITION_CENTER, POSITION_TOP],
    [POSITION_LEFT]: [POSITION_LEFT, POSITION_CENTER],
    [POSITION_BOTTOM]: [POSITION_CENTER, POSITION_BOTTOM]
}

export default class PerspectiveOriginPosition extends UIElement {

    template () {
        return `
            <div class="perspective-drag-position">
                <div ref="$dragPointer" class="drag-pointer"></div>
            </div>
        `
    }

    refresh () {

        var isShow = this.isShow();

        this.$el.toggle(isShow);

        if (isShow) {
            this.refreshUI()            
        }
    }

    isShow () {
        var artboard = editor.selection.artboard
        if (!artboard) return false; 

        return !!artboard.preserve;  
    }

    getCurrentXY(isUpdate, position) {

        if (isUpdate) {
            var xy = this.config('pos');

            return [xy.x, xy.y]
        }

        var { minX, minY, maxX, maxY, width, height } = this.getRectangle()

        let p = position; 
        if (isString(p) && DEFINE_POSITIONS[p]) {
            p = DEFINE_POSITIONS[p]
        } else if (isString(p)) {
            p = p.split(WHITE_STRING);
        } else {
            p = [p.perspectiveOriginPositionX.value, p.perspectiveOriginPositionY.value]
        }

        p = p.map((item, index) => {
            if (item == 'center') {
                if (index == 0) {
                    return minX + width/2
                } else if (index == 1) {
                    return minY + height/2
                }
            } else if (item === 'left') {
                return minX;
            } else if (item === 'right') {
                return maxX;
            } else if (item === 'top') {
                return minY;
            } else if (item === 'bottom') { 
                return maxY;
            } else {
                if (index == 0) {
                    return minX + width * (+item/100); 
                } else if (index == 1) {
                    return minY + height * (+item/100); 
                }
            }
        })
        
        return p; 
    }

    getRectangle () {
        var width = this.$el.width();  
        var height = this.$el.height();  
        var minX = this.$el.offsetLeft();
        var minY = this.$el.offsetTop();

        var maxX = minX + width; 
        var maxY = minY + height;

        return { minX, minY, maxX, maxY, width, height }
    }    

    getDefaultValue() {

        var artboard = editor.selection.artboard
        if (!artboard) return EMPTY_STRING; 

        return {
            perspectiveOriginPositionX: item.perspectiveOriginPositionX,
            perspectiveOriginPositionY: item.perspectiveOriginPositionY
         } || EMPTY_STRING

    }

    refreshUI (isUpdate) {
        var { minX, minY, maxX, maxY, width, height } = this.getRectangle()
        var [x , y] = this.getCurrentXY(isUpdate, this.getDefaultValue())

        x = Math.max(Math.min(maxX, x), minX)
        y = Math.max(Math.min(maxY, y), minY)

        var left = x - minX
        var top = y - minY 

        this.refs.$dragPointer.px('left', left);
        this.refs.$dragPointer.px('top', top);

        if (isUpdate) {

            this.setPerspectiveOriginPosition(
                Length.percent( Math.floor(left/width * 100) ), 
                Length.percent( Math.floor(top/height * 100) )
            );
        }

    }

    setPerspectiveOriginPosition (perspectiveOriginPositionX, perspectiveOriginPositionY) {
        var artboard = editor.selection.artboard; 
        if (artboard) {
            artboard.reset({
                perspectiveOriginPositionX,
                perspectiveOriginPositionY
            })

            editor.send(CHANGE_ARTBOARD, artboard);
        }
    }

    [EVENT(
        CHANGE_ARTBOARD,
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )] () { 
        this.refresh() 
    }

    // Event Bindings 

    move () {
        this.refreshUI(true);
    }

    [POINTERSTART('$dragPointer') + MOVE()] (e) {
        e.preventDefault();
    }
    
    [DOUBLECLICK('$dragPointer')] (e) {
        e.preventDefault()
        this.setPerspectiveOriginPosition(Position.CENTER, Position.CENTER)
        this.refreshUI()
    }
}