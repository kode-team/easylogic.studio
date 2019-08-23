import UIElement, { EVENT } from "../../../../util/UIElement";
import { THROTTLE, IF, PREVENT, KEYDOWN, KEYUP, KEY } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";

export default class KeyframeTimeControl extends UIElement {
    template () {
        return /*html*/`
        <div class='keyframe-time-control'>
            <div class='time-manager'>
                <label>Current <input type="text" ref='$currentTime' /></label>
                <label>FPS <input type="number" ref='$fps' min="0" max="999" /></label>
                <label>Duration <input type="text" ref='$duration' /></label>
            </div>
        </div>`
    }



    refresh () {
        this.refreshTimeInfo();
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

    refreshTimeInfo() {

        var timeline = this.currentTimeline;

        if (timeline) {

            this.refs.$currentTime.val(timeline.currentTimecode);
            this.refs.$duration.val(timeline.totalTimecode);
            this.refs.$fps.val(timeline.fps);
        }

    }

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }

    [EVENT('moveTimeline', 'refreshSelection', 'resizeTimeline') + THROTTLE(10)] (){
        this.refresh();
    }

    [KEYUP('$fps') + KEY('Enter')] (e) {
        var fps = +this.refs.$fps.val();

        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            artboard.setFps(fps);
            this.refreshCanvas();
            this.emit('moveTimeline');            
        }
    }

    checkNumberOrTimecode (e) {
        var value = e.target.value.trim();
        if ((+value) + '' === value) {
            return true; 
        } else if (value.match(/^[0-9:]+$/)) {
            return true; 
        }

        return false;
    }

    checkKey (e) {
        if (e.key.match(/^[0-9:]+$/)) {
            return true; 
        } else if (e.code === 'Backspace' || e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
            return true; 
        }

        return false; 
    }

    [KEYDOWN('$currentTime')] (e) {
        if (!this.checkKey(e)) {
            e.preventDefault();
            e.stopPropagation()
            return false;
        }
    }

    [KEYUP('$currentTime') + KEY('Enter') + IF('checkNumberOrTimecode') + IF('hasCurrentTimeline') + PREVENT] (e) {
        var frame = this.refs.$currentTime.value
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            artboard.setTimelineCurrentTime(frame);
        }

        this.refresh();
        this.emit('moveTimeline');
    }



    [KEYDOWN('$duration')] (e) {
        if (!this.checkKey(e)) {
            e.preventDefault();
            e.stopPropagation()
            return false;
        }
    }

    [KEYUP('$duration') + KEY('Enter') + IF('checkNumberOrTimecode') + IF('hasCurrentTimeline') + PREVENT] (e) {

        var frame = this.refs.$duration.value
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            artboard.setTimelineTotalTime(frame);
        }

        this.refresh();
        this.emit('moveTimeline');
    }
}
