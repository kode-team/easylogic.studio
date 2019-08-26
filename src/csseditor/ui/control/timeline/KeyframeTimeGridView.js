import UIElement, { EVENT } from "../../../../util/UIElement";
import { RESIZE, DEBOUNCE, THROTTLE } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";

export default class KeyframeTimeGridView extends UIElement {
    template () {
        return `<div class='keyframe-time-grid-view'><canvas ref="$canvas"></canvas></div>`
    }

    refresh () {
        this.refreshCanvas();
    }

    get currentTimeline () {
        var currentArtboard = editor.selection.currentArtboard;

        if (currentArtboard) {
            return currentArtboard.getSelectedTimeline();
        }
    }    


    hasCurrentTimeline() {
        return !!this.currentTimeline;
    }



    refreshCanvas() {

        var timeline = this.currentTimeline;

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
                this.drawOption({strokeStyle: '#fc554f', lineWidth: 0.5})
                this.drawLine(left + restX, 0, left + restX, rect.height)
            })
        }

    }

    [RESIZE('window') + DEBOUNCE(100)] () {    
        this.refresh();
    }

    [EVENT('refreshTimeline', 'playTimeline')] ( ) {
        this.refresh();
    }

    [EVENT('moveTimeline', 'refreshSelection') + THROTTLE(10)] (){
        this.refresh();
    }
}
