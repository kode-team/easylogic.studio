import UIElement, { EVENT } from "../../../../../../util/UIElement";
import { WHITE_STRING } from "../../../../../../util/css/types";
import { Length } from "../../../../../../editor/unit/Length";
import { POINTERSTART, MOVE, LOAD, CLICK } from "../../../../../../util/Event";
import RangeEditor from "../RangeEditor";
import { DirectionLength } from "../../../../../../editor/unit/DirectionLength";
import DirectionEditor from "../DirectionEditor";


export default class InsetEditor extends UIElement {

    components () {
        return {
            DirectionEditor,
            RangeEditor
        }
    }

    parseValue (str = '') {
        var [inset, round] = str.split('round')

        var [_count, top, right, bottom, left] = DirectionLength.parse(inset);

        if (round) {

            var [_roundCount, topRadius, rightRadius, bottomRadius, leftRadius] = DirectionLength.parse(round);

        }

        return {
            isAll: _count === 1,
            top, 
            right, 
            bottom, 
            left ,
            round,
            isAllRadius: _roundCount === 1,
            topRadius,
            rightRadius,
            bottomRadius,
            leftRadius
        }
    }

    initState() {
        return this.parseValue(this.props.value)
    }

    template() {

        var { top, right, bottom, left, round} = this.state; 

        var maxWidth = 220;
        var maxHeight = 220; 

        var topX =  Length.percent( Math.abs((left.value - (100 - right.value))/2) ).toPx(maxWidth)
        var topY = top.toPx(maxHeight);

        var bottomX = topX.clone()
        var bottomY = Length.percent(100 - bottom.value).toPx(maxHeight);

        var rightX = Length.percent(100 - right.value).toPx(maxWidth);
        var rightY = Length.percent( Math.abs((top.value - (100 - bottom.value))/2) ).toPx(maxHeight)

        var leftX = left.toPx(maxWidth)
        var leftY = Length.percent( Math.abs((top.value - (100 - bottom.value))/2) ).toPx(maxHeight)

        var roundCheckStatus = round ? 'checked' : '';

        return `
        <div class='clip-path-editor inset-editor'>
            <div class='drag-area' ref='$area'>
                <div class='drag-pointer' data-type='top' ref='$top' style='left: ${topX};top: ${topY};'></div>
                <div class='drag-pointer' data-type='right' ref='$right' style='left: ${rightX};top: ${rightY};'></div>
                <div class='drag-pointer' data-type='bottom' ref='$bottom' style='left: ${bottomX};top: ${bottomY};'></div>
                <div class='drag-pointer' data-type='left' ref='$left' style='left: ${leftX};top: ${leftY};'></div>
                <div class='clip-area' ref='$clipArea' style='left: ${leftX};top: ${topY};width: ${Length.px(rightX.value - left.value)};height: ${Length.px(bottomY.value - topY.value)};'></div>
            </div>
            <div class='round-area'>
                <label><input type="checkbox" ${roundCheckStatus} ref='$hasRound' /> Round </label>
                <div ref='$round'></div>
            </div>
        </div>
    `
    }

    [CLICK('$hasRound')] (e) {
       this.updateData({
           round: this.refs.$hasRound.checked()
       }) 
    }


    [LOAD('$round')] () {
        var {topRadius, rightRadius, bottomRadius, leftRadius} = this.state

        var value = [topRadius, rightRadius, bottomRadius, leftRadius].join(WHITE_STRING)

        return `<DirectionEditor 
                ref='$borderRadius' 
                value='${value}' 
                onchange='changeBorderRadius' 
                />`
    }

    [EVENT('changeBorderRadius')] ([_count, topRadius, rightRadius, bottomRadius, leftRadius]) {

        this.updateData({ 
            isAllRadius: _count === 1,
            topRadius, 
            rightRadius, 
            bottomRadius, 
            leftRadius
        })

    }


    // 버그가 많다. 
    // 몇가지를 더 해야한다. 

    // 1. top, bottom, 또는 right, left 는 서로의 경계를 넘어갈 수가 없다. 
    // 2. clipRect 를 드래그 할 때 width, height 안 맞는 문제 해결해야함 
    refreshPointer () {
        var { top, right, bottom, left} = this.state; 

        var maxWidth = 220;
        var maxHeight = 220; 

        var halfWidth = Math.abs((left.value + (100 - right.value))/2);
        var halfHeight = Math.abs((top.value + (100 - bottom.value))/2);

        var topX =  Length.percent( halfWidth ).toPx(maxWidth)
        var topY = top.toPx(maxHeight);

        var bottomX = Length.percent( halfWidth ).toPx(maxWidth)
        var bottomY = Length.percent(100 - bottom.value).toPx(maxHeight);

        var rightX = Length.percent(100 - right.value).toPx(maxWidth);
        var rightY = Length.percent( halfHeight ).toPx(maxHeight)

        var leftX = left.toPx(maxWidth)
        var leftY = Length.percent( halfHeight ).toPx(maxHeight)

        this.refs.$top.css({ left: topX, top: topY })
        this.refs.$right.css({ left: rightX, top: rightY })
        this.refs.$bottom.css({ left: bottomX, top: bottomY })
        this.refs.$left.css({ left: leftX, top: leftY })

        this.refs.$clipArea.css({
            left: leftX,
            top: topY,
            width: Length.px(rightX.value - leftX.value),
            height: Length.px(bottomY.value - topY.value)
        })
    }

    [POINTERSTART('$area .clip-area') + MOVE('moveClipArea')] (e) {

        this.type = e.$delegateTarget.attr('data-type');
        this.$target = e.$delegateTarget;
        this.areaRect = this.refs.$area.rect(); 
        this.startXY = e.xy; 

        this.clipRect = {
            left: Length.parse(this.$target.css('left')),
            top: Length.parse(this.$target.css('top')),
            width: Length.parse(this.$target.css('width')),
            height: Length.parse(this.$target.css('height')),
        }

    }

   
    moveClipArea (dx, dy) {

        var clipWidth = this.clipRect.width.value;
        var clipHeight = this.clipRect.height.value;
        var x = this.clipRect.left.value + dx;
        var y = this.clipRect.top.value + dy;

        if (0 > x) {
            x = 0; 
        } else if (this.areaRect.width < x + clipWidth) {
            x = this.areaRect.width - clipWidth; 
        }

        if (0 > y) {
            y = 0; 
        } else if (this.areaRect.height < y + clipHeight) {
            y = this.areaRect.height - clipHeight; 
        }        

        var left = Length.px(x)
        var top = Length.px(y)

        this.updateData({ 
            top : top.toPercent(this.areaRect.height).round(100),
            bottom : Length.px(this.areaRect.height -  (y + clipHeight) ).toPercent(this.areaRect.height).round(100),
            right : Length.px(this.areaRect.width - (x + clipWidth)).toPercent(this.areaRect.width).round(100),
            left : left.toPercent(this.areaRect.width).round(100) 
        })


        this.refreshPointer();

    } 


    [POINTERSTART('$area .drag-pointer') + MOVE()] (e) {

        this.type = e.$delegateTarget.attr('data-type');
        this.$target = e.$delegateTarget;
        this.areaRect = this.refs.$area.rect(); 
        this.startXY = e.xy; 
    }

    move (dx, dy) {
        var x = this.startXY.x + dx;
        var y = this.startXY.y + dy;  

        if (this.areaRect.x > x) {
            x = this.areaRect.x; 
        } else if (this.areaRect.right < x) {
            x = this.areaRect.right; 
        }

        if (this.areaRect.y > y) {
            y = this.areaRect.y; 
        } else if (this.areaRect.bottom < y) {
            y = this.areaRect.bottom; 
        }        

        var left = Length.px(x - this.areaRect.x)
        var top = Length.px(y - this.areaRect.y)

        if (this.type === 'top') {
            this.updateData({ 
                top : top.toPercent(this.areaRect.height) 
            })            
        } else if (this.type === 'bottom') {
            this.updateData({ 
                bottom : Length.px(this.areaRect.height -  top.value).toPercent(this.areaRect.height) 
            })
        } else if (this.type === 'right') {
            this.updateData({ 
                right : Length.px(this.areaRect.width - left.value).toPercent(this.areaRect.width) 
            })                                    
        } else if (this.type === 'left') {
            this.updateData({ 
                left : left.toPercent(this.areaRect.width) 
            })
        }

        this.refreshPointer();

    }

    toClipPathValueString () {

        var {top, right, left, bottom, round, topRadius, leftRadius, bottomRadius, rightRadius} = this.state;

        var position = [top, right, bottom, left].join(WHITE_STRING)
        var radius = [topRadius, rightRadius, bottomRadius, leftRadius].join(WHITE_STRING)

        var results = `${position} ${(round && radius.trim()) ? `round ${radius}` : ''}`

        return results;
    }

    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)
    }

}