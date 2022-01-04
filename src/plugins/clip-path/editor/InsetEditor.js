

import { Length } from "el/editor/unit/Length";
import { POINTERSTART, LOAD, CLICK, BIND, SUBSCRIBE_SELF } from "el/sapa/Event";
import { DirectionLength } from "el/editor/unit/DirectionLength";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { MOVE } from "el/editor/types/event";


export default class InsetEditor extends EditorElement {

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

        return /*html*/`
        <div class='clip-path-editor inset-editor'>
            <div class='drag-area' ref='$area'>
                <div class='drag-pointer' data-type='top' ref='$top' style='left: ${topX};top: ${topY};'></div>
                <div class='drag-pointer' data-type='right' ref='$right' style='left: ${rightX};top: ${rightY};'></div>
                <div class='drag-pointer' data-type='bottom' ref='$bottom' style='left: ${bottomX};top: ${bottomY};'></div>
                <div class='drag-pointer' data-type='left' ref='$left' style='left: ${leftX};top: ${leftY};'></div>
                <div class='clip-area inset' ref='$clipAreaView' style='pointer-events: none;'></div>
                <div class='clip-area-handle' ref='$clipArea' style='left: ${leftX};top: ${topY};width: ${Length.px(rightX.value - left.value)};height: ${Length.px(bottomY.value - topY.value)};'></div>
            </div>
            <div class='round-area'>
                <label><input type="checkbox" ${roundCheckStatus} ref='$hasRound' /> Round </label>
                <div ref='$round'></div>
            </div>
        </div>
    `
    }

   

    [BIND('$clipAreaView')] () {
        return {
            style : {
                'clip-path' : `${this.props.key}(${this.toClipPathValueString()})`
            }
        }
    }   

    [CLICK('$hasRound')] (e) {
       this.updateData({
           round: this.refs.$hasRound.checked()
       }) 

       this.bindData('$clipAreaView')
    }


    [LOAD('$round')] () {
        var {topRadius, rightRadius, bottomRadius, leftRadius} = this.state

        var value = [topRadius, rightRadius, bottomRadius, leftRadius].join(' ')

        return /*html*/`<object refClass="DirectionEditor" ref='$borderRadius' value='${value}' onchange='changeBorderRadius' />`
    }

    [SUBSCRIBE_SELF('changeBorderRadius')] ([_count, topRadius, rightRadius, bottomRadius, leftRadius]) {

        this.updateData({ 
            isAllRadius: _count === 1,
            topRadius, 
            rightRadius, 
            bottomRadius, 
            leftRadius
        })

        this.bindData('$clipAreaView')        

    }

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
            width: rightX.value - leftX.value,
            height: bottomY.value - topY.value
        })

        this.bindData('$clipAreaView')
    }

    [POINTERSTART('$area .clip-area-handle') + MOVE('moveClipArea')] (e) {

        this.type = e.$dt.attr('data-type');
        this.$target = e.$dt;
        this.areaRect = this.refs.$area.rect(); 
        this.startXY = e.xy; 

        this.clipRect = {
            left: Length.parse(this.$target.css('left')).value,
            top: Length.parse(this.$target.css('top')).value,
            width: Length.parse(this.$target.css('width')).value,
            height: Length.parse(this.$target.css('height')).value,
        }

    }

   
    moveClipArea (dx, dy) {

        var clipWidth = this.clipRect.width;
        var clipHeight = this.clipRect.height;
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

        var left = x
        var top = y

        this.updateData({ 
            top : Length.px(top).toPercent(this.areaRect.height).round(100),
            bottom : Length.px(this.areaRect.height -  (y + clipHeight) ).toPercent(this.areaRect.height).round(100),
            right : Length.px(this.areaRect.width - (x + clipWidth)).toPercent(this.areaRect.width).round(100),
            left : Length.px(left).toPercent(this.areaRect.width).round(100) 
        })


        this.refreshPointer();

    } 


    [POINTERSTART('$area .drag-pointer') + MOVE()] (e) {

        this.type = e.$dt.attr('data-type');
        this.$target = e.$dt;
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

        var left = x - this.areaRect.x
        var top = y - this.areaRect.y

        if (this.type === 'top') {
            this.updateData({ 
                top : Length.px(top).toPercent(this.areaRect.height).round(100) 
            })            
        } else if (this.type === 'bottom') {
            this.updateData({ 
                bottom : Length.px(this.areaRect.height -  top).toPercent(this.areaRect.height).round(100)
            })
        } else if (this.type === 'right') {
            this.updateData({ 
                right : Length.px(this.areaRect.width - left).toPercent(this.areaRect.width).round(100)
            })                                    
        } else if (this.type === 'left') {
            this.updateData({ 
                left : Length.px(left).toPercent(this.areaRect.width).round(100) 
            })
        }

        this.refreshPointer();

    }

    toClipPathValueString () {

        var {top, right, left, bottom, round, topRadius, leftRadius, bottomRadius, rightRadius} = this.state;

        var position = [top, right, bottom, left].join(' ')
        var radius = [topRadius, rightRadius, bottomRadius, leftRadius].join(' ')

        var results = `${position} ${(round && radius.trim()) ? `round ${radius}` : ''}`

        return results;
    }

    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)
    }

}