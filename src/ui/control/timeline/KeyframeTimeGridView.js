import UIElement, { EVENT } from "@sapa/UIElement";
import { RESIZE, DEBOUNCE, THROTTLE } from "@sapa/Event";
import { registElement } from "@sapa/registerElement";

export default class KeyframeTimeGridView extends UIElement {
    template () {
        return /*html*/`
            <div class='keyframe-time-grid-view'>
                <canvas ref="$canvas"></canvas>
            </div>
        `
    }

    refresh () {
        this.refreshCanvas();
    }

    currentTimeline () {
        var project = this.$selection.currentProject;

        if (project) {
            return project.getSelectedTimeline();
        }
    }    


    hasCurrentTimeline() {
        return !!this.currentTimeline();
    }



    refreshCanvas() {
        const strokeStyle = this.$theme('timeline_line_color'); 
        const timeline = this.currentTimeline();

        if (timeline) {
            var originalRect = this.$el.rect()
            var { width } = originalRect;
            var { currentTime, displayStartTime, displayEndTime } = timeline;

            this.refs.$canvas.resize(this.$el.rect());
            this.refs.$canvas.update(function () {
                var rect = this.rect();
                var realWidth = width - 20; 
                var restX = 10;             

                var left =  (currentTime - displayStartTime)/(displayEndTime - displayStartTime) * realWidth;
                this.drawOption({strokeStyle, lineWidth: 1})
                this.drawLine(left + restX, 0, left + restX, rect.height)
            })
        }

    }

    [EVENT('resize.window') + DEBOUNCE(100)] () { 
        this.refresh();
    }

    [EVENT('refreshTimeline', 'playTimeline', 'toggleFooterEnd')] ( ) {
        this.refresh();
    }

    [EVENT('moveTimeline', 'refreshSelection') + THROTTLE(50)] (){
        this.refresh();
    }
}

registElement({ KeyframeTimeGridView })