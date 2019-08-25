import UIElement, { EVENT } from "../../../../util/UIElement";
import { RESIZE, DEBOUNCE, POINTERSTART, MOVE, THROTTLE, IF, PREVENT, KEYDOWN, KEYUP, KEY, END } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
import { second, framesToTimecode } from "../../../../util/functions/time";

const PADDING = 20 

export default class KeyframeTimeView extends UIElement {
    template () {
        return /*html*/`
        <div class='keyframe-time-view'>
            <div class='time-duration'>
                <div class='duration-handle-left'></div>
                <div class='duration-handle-right'></div>
                <div class='duration-slider' ref='$slider'>
                    <div class='gauge' ref='$gauge'></div>
                    <div class='start' ref='$start'></div>
                    <div class='end' ref='$end'></div>
                </div>
            </div>
            <canvas ref="$canvas"></canvas>
        </div>`
    }



    refresh () {
        this.refreshTimeDisplay();
        this.refreshCanvas();
    }

    get currentTimeline () {
        var currentArtboard = editor.selection.currentArtboard;

        if (currentArtboard) {
            return currentArtboard.getSelectedTimeline();
        }

        return null; 
    }

    hasCurrentTimeline() {
        return !!this.currentTimeline;
    }

    refreshTimeDisplay() {

        var timeline = this.currentTimeline;

        if (timeline) {
            var start = Length.percent(timeline.displayStartTime/timeline.totalTime * 100);
            var end = Length.percent(timeline.displayEndTime/timeline.totalTime * 100);
    
            this.refs.$start.css('left', start)
            this.refs.$end.css('left', end)
            this.refs.$gauge.css({
                'left': start,
                'width': Length.percent(end.value - start.value)
            })
    
        }

    }

    [POINTERSTART('$start') + IF('hasCurrentTimeline') + MOVE('moveStartButton')] (e) {
        this.sliderRect = this.refs.$slider.rect();
        this.endX = Length.parse(this.refs.$end.css('left')).toPx(this.sliderRect.width);
        // this.timeline = this.currentTimeline;
        this.artboard = editor.selection.currentArtboard;

    }

    moveStartButton () {
        var currentX = editor.config.get('pos').x - this.sliderRect.x;
        var minX = 0; 
        var maxX =  this.endX; 

        currentX = Math.max(currentX, minX);
        currentX = Math.min(currentX, maxX);

        var displayTimeRate = currentX / this.sliderRect.width;

        this.artboard.setDisplayStartTimeRate(displayTimeRate);

        this.refreshTimeDisplay();
        this.refreshCanvas();        
        this.emit('moveTimeline');
    }


    [POINTERSTART('$end') + IF('hasCurrentTimeline') + MOVE('moveEndButton')] (e) {
        this.sliderRect = this.refs.$slider.rect();
        this.startX = Length.parse(this.refs.$start.css('left')).toPx(this.sliderRect.width);
        // this.timeline = this.currentTimeline;
        this.artboard = editor.selection.currentArtboard;        

    }

    moveEndButton () {
        var currentX = editor.config.get('pos').x - this.sliderRect.x;
        var minX = this.startX; 
        var maxX =  this.sliderRect.width; 

        currentX = Math.max(currentX, minX);
        currentX = Math.min(currentX, maxX);

        var displayTimeRate = currentX / this.sliderRect.width;

        this.artboard.setDisplayEndTimeRate(displayTimeRate);

        this.refreshTimeDisplay();
        this.refreshCanvas();        
        this.emit('moveTimeline');
    }    


    [POINTERSTART('$gauge') + IF('hasCurrentTimeline') + MOVE('moveGaugeButton')] (e) {
        this.sliderRect = this.refs.$slider.rect();
        var {displayStartTime, displayEndTime} = this.currentTimeline;
        this.timelineStartTime = displayStartTime
        this.timelineEndTime = displayEndTime
        this.artboard = editor.selection.currentArtboard;    
    }

    moveGaugeButton (dx, dy) {

        var dxRate = dx / this.sliderRect.width; 

        this.artboard.setDisplayTimeDxRate(dxRate, this.timelineStartTime, this.timelineEndTime);

        this.refreshTimeDisplay();
        this.refreshCanvas();
        this.emit('moveTimeline');
    }        

    config (key) {
        return this.parent.state[key]
    }

    setConfig (key, value) {
        this.parent.setState({[key]: value}, false)
    }


    refreshCanvas() {

        var timeline = this.currentTimeline;

        if (timeline) {


            var originalRect = this.$el.rect()
            var { width, height } = originalRect;

            var {displayStartTime, displayEndTime, fps, currentTime} = timeline

            var startFrame = Math.floor(displayStartTime * fps); 
            var endFrame = Math.floor(displayEndTime * fps); 
            var width = originalRect.width; 

            var totalFrame = endFrame - startFrame;
            var splitFrame = 5; 

            if (totalFrame < 100) {
                splitFrame = 10; 
            } else if (totalFrame < 1000) {
                splitFrame = 100; 
            } else if (totalFrame < 10000) {
                splitFrame = 1000; 
            } else if (totalFrame < 100000) {
                splitFrame = 10000; 
            }


            if (startFrame % splitFrame !== 0) {
                startFrame = startFrame + (splitFrame - (startFrame % splitFrame)); 
            }

            var textOption = {
                textAlign: 'center',
                textBaseline: 'middle',
                font: '10px sans-serif'
            }
            
            this.refs.$canvas.resize({
                width,
                height: height/2
            });
            this.refs.$canvas.update(function () {
                var rect = this.rect();
                var realWidth = width - PADDING; 
                this.drawOption({strokeStyle: 'rgba(204, 204, 204, 0.3)',  lineWidth: 0.5, ...textOption})
                var restX = 10 

                for(; startFrame < endFrame; startFrame += splitFrame) {
                    var y = rect.height / 4;
                    var startX = (second(fps, startFrame) - displayStartTime)/(displayEndTime - displayStartTime) * realWidth;
                    this.drawOption({ fillStyle: '#ececec'})                                
                    this.drawText(startX + restX, y, framesToTimecode(fps, startFrame).replace(/00\:/g, '') + 'f')
                }


                this.drawOption({strokeStyle: 'black', lineWidth: 1})
                this.drawLine(0, rect.height, rect.width, rect.height);

                var left =  (currentTime - displayStartTime)/(displayEndTime - displayStartTime) * realWidth;
                var markTop = 10
                var markWidth = 4
                this.drawOption({strokeStyle: '#fc554f',fillStyle: '#fc554f', lineWidth: 1})
                this.drawPath(
                    [left - markWidth + restX, rect.height - markTop],
                    [left + markWidth + restX, rect.height - markTop],
                    [left + markWidth + restX, rect.height - markWidth],
                    [left + restX, rect.height],
                    [left - markWidth + restX, rect.height - markWidth],
                    [left - markWidth + restX, rect.height - markTop]
                )

                
            })
        }
    }

    [POINTERSTART('$canvas') + IF('hasCurrentTimeline') + MOVE() + END('moveEndCurrentTime')] (e) {
        this.selectedCanvasOffset = this.refs.$canvas.offset()
        this.originalRect = this.$el.rect()    
        this.width = this.originalRect.width - PADDING;     
        this.artboard = editor.selection.currentArtboard
        this.emit('hideSelectionToolView')
        editor.selection.empty()
        this.emit('refreshSelection');
    }

    move () {

        var totalWidth = this.width; 
        var minX = 0;
        var maxX = totalWidth;
        var currentX = editor.config.get('pos').x - this.selectedCanvasOffset.left; 

        currentX = Math.max(currentX, minX);
        currentX = Math.min(currentX, maxX);

        this.artboard.setTimelineCurrentTimeRate(currentX / totalWidth);

        this.refresh();
        this.artboard.seek();

        this.emit('moveTimeline')
        // this.emit('refreshSelection')        
    }

    moveEndCurrentTime () {
        editor.selection.setRectCache();
        this.emit('refreshSelectionTool')
    }

    [RESIZE('window') + DEBOUNCE(100)] () {    
        this.refresh();
    }

    [EVENT('refreshTimeline', 'playTimeline')] () {
        this.refresh();
    }

    [EVENT('moveTimeline', 'refreshSelection', 'resizeTimeline') + THROTTLE(10)] (){
        this.refresh();
    }
}
