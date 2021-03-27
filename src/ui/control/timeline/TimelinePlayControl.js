import UIElement, { EVENT } from "@sapa/UIElement";
import { CLICK, INPUT, BIND } from "@sapa/Event";
import icon from "@icon/icon";
import { registElement } from "@sapa/registerElement";

export default class TimelinePlayControl extends UIElement {
    
    template() {

        return /*html*/`
            <div class='timeline-play-control' >
                <div class='row'>
                    <div class='play-buttons' ref='$playButtons' data-status='${this.state.status}'>
                        <button type="button" data-value='play' class='play' title='${this.$i18n('timeline.play.control.play')}'>${icon.play}</button>
                        <button type="button" data-value='pause' class='pause' title='${this.$i18n('timeline.play.control.pause')}'>${icon.pause}</button>                
                        <button type="button" data-value='first' class='first' title='${this.$i18n('timeline.play.control.first')}'>${icon.skip_prev}</button>
                        <button type="button" data-value='prev' class='prev' title='${this.$i18n('timeline.play.control.prev')}'>${icon.fast_rewind}</button>                    
                        <button type="button" data-value='next' class='next' title='${this.$i18n('timeline.play.control.next')}'>${icon.fast_forward}</button>
                        <button type="button" data-value='last' class='last' title='${this.$i18n('timeline.play.control.last')}'>${icon.skip_next}</button>
                    </div>
                </div>
                <div class='row'>            
                    <label title='Speed'>${this.$i18n('timeline.play.control.speed')}</label>
                    <div class='input speed-number' >
                        <input type='number' min="0.1" max="10" step="0.1" ref='$speed' value='${this.state.speed}' />
                    </div>
                </div>                
                <div class='row'>            
                    <label><span ref='$repeatStatus'>${this.$i18n('timeline.play.control.repeat')}</span></label>
                    <div class='input' >
                        <input type='number' min="0" max="100" step="1" ref='$iteration' value='${this.state.iterationCount}' />
                    </div> 
                </div>
                <div class='row'>
                    <label> ${this.$i18n('timeline.play.control.direction')}</label>
                    <div class='direction-buttons' ref='$direction' data-selected-direction='${this.state.direction}'>
                        <button type="button" data-value='normal' title='${this.$i18n('timeline.play.control.normal')}'>${icon.arrowRight}</button>
                        <button type="button" data-value='alternate' title='${this.$i18n('timeline.play.control.alternate')}'>${icon.alternate}</button>
                        <button type="button" data-value='reverse' title='${this.$i18n('timeline.play.control.reverse')}' style='transform: rotateY(180deg)'>${icon.arrowRight}</button>
                        <button type="button" data-value='alternate-reverse' title='${this.$i18n('timeline.play.control.alternate.reverse')}' style='transform: rotateY(180deg)'>${icon.alternate_reverse}</button>
                    </div>
                </div>                                
            </div>
        `
    }

    initState() {

        var speed = 1
        var iterationCount = 1
        var direction = 'normal'

        var timeline = this.getSelectedTimeline();

        if (timeline) {
            var { speed, iterationCount, direction } = timeline; 
        }


        return {
            status: 'pause',
            speed,
            iterationCount,
            direction
        }
    }


    getSelectedTimeline () {

        var project = this.$selection.currentProject;
        if (project) {
            return project.getSelectedTimeline();
        }
    }

    updateData(obj) {
        this.setState(obj, false);
        var project = this.$selection.currentProject;
        if (project) {
            project.setTimelineInfo(obj);
        }
    }

    [CLICK('$playButtons button')] (e) {

        var status = e.$dt.attr('data-value')

        this.setState({ status })

        if (status === 'play') {
            this.play();
        } else if (status === 'pause') {
            this.pause();
        } else if (status === 'first') {
            this.first();
        } else if (status === 'prev') {
            this.prev();
        } else if (status === 'next') {
            this.next()
        } else if (status === 'last') {
            this.last()
        }

    }

    first () {
        this.emit('firstTimelineItem')
        this.$editor.changeMode('SELECTION');
        this.emit('afterChangeMode')
    }

    prev () {
        this.emit('prevTimelineItem')
        this.$editor.changeMode('SELECTION');
        this.emit('afterChangeMode')
    }
    
    next () {
        this.emit('nextTimelineItem')
        this.$editor.changeMode('SELECTION');
        this.emit('afterChangeMode')           
    }
    
    last () {
        this.emit('lastTimelineItem')
        this.$editor.changeMode('SELECTION');
        this.emit('afterChangeMode')             
    }    

    play () {
        this.emit('playTimelineItem', this.state.speed, this.state.iterationCount, this.state.direction);
    }

    pause () {
        this.emit('pauseTimelineItem');
        this.$editor.changeMode('SELECTION');
        this.emit('afterChangeMode')
    }

    [EVENT('stopTimeline')] () {
        this.updateData({
            status: 'pause'
        })
    }
   
    [CLICK('$direction button')] (e) {
        this.updateData({
            direction: e.$dt.attr('data-value')
        })
        this.refresh();        
    }    

    [CLICK('$repeatStatus')] (e) {

        var count = this.refs.$iteration.value; 
        var iterationCount = 0; 

        if (count === 0) {
            iterationCount = 1; 
        } 

        this.updateData({ iterationCount })
        this.refs.$iteration.val(iterationCount);
        this.bindData('$repeatStatus');
    }

    [INPUT('$iteration')] (e) {
        this.updateData({
            iterationCount: +this.refs.$iteration.value
        })
        this.bindData('$repeatStatus');
    }

    [INPUT('$speed')] (e) {
        this.updateData({
            speed: +this.refs.$speed.value 
        })
    }    


    [BIND('$repeatStatus')] () {
        return {
            text: this.state.iterationCount === 0 ? this.$i18n('timeline.play.control.infinite'): this.$i18n('timeline.play.control.repeat')
        }
    }    

    [BIND('$playButtons')] () {
        return {
            'data-status': this.state.status
        }
    }

    [BIND('$direction') ] () {
        return {
            'data-selected-direction' : this.state.direction
        }
    }    

    [EVENT('selectTimeline')] () {
        this.refresh();
    } 

}

registElement({ TimelinePlayControl })