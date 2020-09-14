import UIElement, { EVENT } from "@core/UIElement";
import icon from "@icon/icon";
import { CLICK, POINTERSTART, MOVE, END } from "@core/Event";
import { Length } from "@unit/Length";
import { formatCubicBezier, createBezierForPattern, bezierList, getPredefinedCubicBezier } from "@core/functions/bezier";
import { div } from "@core/functions/math";


export default class CubicBezierEditor extends UIElement {

    initState() {
        return {
            key: this.props.key,
            currentBezier: getPredefinedCubicBezier( this.props.value || 'linear'),
            currentBezierIndex: 0,
            selectedColor: '#609de2',
            animatedColor: '#609de266',
            curveColor: '#609de2',
            baseLineColor: 'rgba(117, 117, 117, 0.46)'
        }
    }

    template () {
        return /*html*/`
            <div class='cubic-bezier-editor'>
                <div class='predefined'>
                    <div class='left' ref='$left'>${icon.chevron_left}</div>
                    <div class='predefined-text' ref='$text'></div>
                    <div class='right' ref='$right'>${icon.chevron_right}</div>
                </div>
                <div class='animation'>
                    <canvas 
                        class='animation-canvas' 
                        ref='$animationCanvas' 
                        title='Click and Replay point animation' 
                        width='230px' 
                        height='20px'
                    ></canvas>
                </div>
                <div class='item-list' ref='$itemList' data-selected-value=''>
                    <div class='item' data-bezier='ease' title='ease'>
                        <canvas class='item-canvas' ref='$item1Canvas' width="30px" height="30px"></canvas>
                    </div>
                    <div class='item' data-bezier='ease-in' title='ease-in'>
                        <canvas class='item-canvas' ref='$item2Canvas' width="30px" height="30px"></canvas>
                    </div>
                    <div class='item' data-bezier='ease-out' title='ease-out'>
                        <canvas class='item-canvas' ref='$item3Canvas' width="30px" height="30px"></canvas>
                    </div>
                </div>
                <div class='bezier'>
                    <canvas class='bezier-canvas' ref='$canvas' width='200px' height="200px"></canvas>
                    <div class='control' ref='$control'>
                        <div class='pointer1' ref='$pointer1'></div>
                        <div class='pointer2' ref='$pointer2'></div>
                    </div>
                </div>
            </div>
        `
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyCubicBezier();
    }

    modifyCubicBezier () {
        this.parent.trigger(this.props.onchange, this.state.key, formatCubicBezier(this.state.currentBezier))
    }

    [CLICK('$left')] () {
        var { currentBezier, currentBezierIndex} = this.state;

        if (currentBezierIndex == 0) {
            currentBezierIndex = bezierList.length - 1;
        }  else {
            --currentBezierIndex;
        }

        var currentBezier = bezierList[currentBezierIndex]

        this.updateData({ currentBezierIndex, currentBezier })

        this.refresh();
    }

    [CLICK('$right')] (){
        var { currentBezier, currentBezierIndex} = this.state;

        currentBezierIndex = (++currentBezierIndex) % bezierList.length;
        currentBezier = bezierList[currentBezierIndex];

        this.updateData({ currentBezierIndex, currentBezier })

        this.refresh();
    }

    [CLICK('$text')] () {
        var currentBezier =  [...bezierList[this.state.currentBezierIndex]]

        this.updateData({ currentBezier });
        this.refresh();
    }

    [CLICK('$itemList .item')] (e) {
        var bezierString = e.$dt.attr('data-bezier');
        this.refs.$itemList.attr('data-selected-value', bezierString)

        var currentBezier = getPredefinedCubicBezier(bezierString)
        this.updateData({
            currentBezier
        })

        this.refresh();
    }

    refresh() {
        this.refreshPointer()
        this.refreshEasingText();
        this.refreshBezierCanvas();
    }

    refreshBezierCanvas () {
        this.drawBezierCanvas(this.refs.$canvas, this.state.currentBezier, true)
    }

    drawBezierCanvas($canvas, currentBezier, isDrawPointer = false) {
        currentBezier = getPredefinedCubicBezier(currentBezier)
        $canvas.update(() => {
            var left = isDrawPointer ? 30 : 0; 
            var top = isDrawPointer ? 30 : 0; 
            var width = $canvas.width() - left * 2;
            var height = $canvas.height() - top * 2;
            var context = $canvas.context();

            context.lineWidth = 1;
            context.strokeStyle = this.state.baseLineColor;
    
            context.beginPath();
            context.moveTo(left, height + top);
            context.lineTo(width + left, top);
            context.stroke();
            context.closePath();
    
            context.strokeStyle = this.state.selectedColor;
    
            context.beginPath();
            context.moveTo(left, height + top);
            context.lineTo(
                currentBezier[0] * width + left, 
                (currentBezier[1] == 0 ? height : (1 - currentBezier[1]) * height) + top
            );
            context.moveTo(width + left, top);
            context.lineTo(
                currentBezier[2] * width + left, 
                (currentBezier[3] == 1 ? 0 : (1 - currentBezier[3] ) * height) + top
            );
            context.stroke();
            context.closePath();
    
            context.lineWidth = 2;
            context.strokeStyle = this.state.curveColor;
            
            var x1 = currentBezier[0] * width
            var y1 = currentBezier[1] == 0 ? height : (1 - currentBezier[1]) * height 
            var x2 = currentBezier[2] * width
            var y2 = currentBezier[3] == 1 ? 0 : (1 - currentBezier[3] ) * height
            var x = width
            var y = 0

            context.beginPath();
            context.moveTo(left , top + height);   
            context.bezierCurveTo( 
                left + x1, top + y1,
                left + x2, top + y2, 
                left + x, top + y 
            );
            context.stroke();
        })

        if (isDrawPointer) {
            this.drawPoint()
        }

    }

    refreshEasingText() {
        this.refs.$text.html(this.state.currentBezier[4] || 'ease');
    }

    refreshPointer () {
        var currentBezier = getPredefinedCubicBezier(this.state.currentBezier)
        var width = this.refs.$control.width();
        var height = this.refs.$control.height();

        var left = currentBezier[0] * width;
        var top = (1 - currentBezier[1]) * height;

        this.refs.$pointer1.css({
            left: Length.px(left),
            top : Length.px(top)
        });

        left = currentBezier[2] * width ;
        top = (1 - currentBezier[3]) * height;

        this.refs.$pointer2.css({
            left: Length.px(left),
            top : Length.px(top)
        })
    }

    drawPoint () {

        if (this.timer) clearTimeout(this.timer);
        if (this.animationTimer) clearTimeout(this.animationTimer);

        this.timer = setTimeout(() =>{
            this.animationPoint ();
        }, 100);
    }


    start (i) {

        var pos = this.animationCanvasData.func(i);
        var x = 10 + (this.animationCanvasData.width - 20) * pos.y;       
        var y = 10
        var context = this.animationCanvasData.context;



        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.closePath();

        if (i >= 1) {
            return;
        }

        this.animationTimer = setTimeout(() => { 
            this.start(i + 0.05); 
        }, 50);
    }

    animationPoint () {
        const currentBezier = getPredefinedCubicBezier(this.state.currentBezier);
        var func = createBezierForPattern(formatCubicBezier(currentBezier));    

        this.refs.$animationCanvas.clear();
        var width = this.refs.$animationCanvas.width();
        var height = this.refs.$animationCanvas.height();

        var context = this.refs.$animationCanvas.context();
        context.fillStyle = this.state.animatedColor;
        context.strokeStyle = this.state.selectedColor;
        context.lineWidth = 1;

        this.animationCanvasData = {
            func, 
            width, 
            height,
            context
        }


        this.start(0);


    }


    setPosition($pointer, e) {
        var width = this.refs.$control.width();
        var height = this.refs.$control.height();

        var minX = this.refs.$control.offset().left;
        var minY = this.refs.$control.offset().top;

        var p = e;

        var x = p.x;
        if (0 > x) {
            x = 0;
        } else if (p.x > document.body.clientWidth) {
            x = document.body.clientWidth;            
        }

        x -= minX;

        if (x < 0) {
            x = 0; 
        }

        if (width < x) {
            x = width; 
        }

        var y = p.y;
        if (0 > y) {
            y = 0;
        } else if (p.y > document.body.clientHeight) {
            y = document.body.clientHeight;
        }

        y -= minY;

        $pointer.css({
            left: x + 'px',
            top : y + 'px'
        });

        return { 
            x : div(x, width), 
            y : (y == height ) ? 0 : (height-y) / height 
        };
    }

    [POINTERSTART('$pointer1') + MOVE('movePointer1') + END('drawPoint')] (e) {
        this.clientX = e.clientX
        this.clientY = e.clientY
    }

    movePointer1 (dx, dy) {
        var pos = this.setPosition(this.refs.$pointer1, {
            x: this.clientX + dx,
            y: this.clientY + dy 
        });

        this.state.currentBezier[0] = pos.x;
        this.state.currentBezier[1] = pos.y;

        this.refreshBezierCanvas();

        this.modifyCubicBezier();
    }

    [POINTERSTART('$pointer2') + MOVE('movePointer2') + END('drawPoint')] (e) {
        this.clientX = e.clientX
        this.clientY = e.clientY
    }
    movePointer2(dx, dy) {

        var pos = this.setPosition(this.refs.$pointer2, {
            x: this.clientX + dx,
            y: this.clientY + dy 
        });

        this.state.currentBezier[2] = pos.x;
        this.state.currentBezier[3] = pos.y;

        this.refreshBezierCanvas();

        this.modifyCubicBezier();

    }

    [EVENT('showCubicBezierEditor')] (timingFunction) {
        var currentBezier = getPredefinedCubicBezier(timingFunction || this.state.currentBezier)
        this.setState({ currentBezier })
        this.refresh();
        this.drawBezierCanvas(this.refs.$item1Canvas, 'ease')
        this.drawBezierCanvas(this.refs.$item2Canvas, 'ease-in')
        this.drawBezierCanvas(this.refs.$item3Canvas, 'ease-out')
    }
}