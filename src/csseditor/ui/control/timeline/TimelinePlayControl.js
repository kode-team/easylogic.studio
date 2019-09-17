import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, INPUT, BIND } from "../../../../util/Event";
import icon from "../../icon/icon";
import { editor } from "../../../../editor/editor";

export default class TimelinePlayControl extends UIElement {
    
    template() {
        return /*html*/`
            <div class='timeline-play-control' >
                <div class='row'>
                    <div class='play-buttons' ref='$playButtons' data-status='${this.state.status}'>
                        <button type="button" data-value='play' class='play'>${icon.play}</button>
                        <button type="button" data-value='pause' class='pause'>${icon.pause}</button>                
                        <button type="button" data-value='first' class='first'>${icon.skip_prev}</button>
                        <button type="button" data-value='prev' class='prev'>${icon.fast_rewind}</button>                    
                        <button type="button" data-value='next' class='next'>${icon.fast_forward}</button>
                        <button type="button" data-value='last' class='last'>${icon.skip_next}</button>
                    </div>
                </div>
                <div class='row'>            
                    <label title='Speed'>${icon.speed} Speed</label>
                    <div class='input speed-number' >
                        <input type='number' min="0.1" max="10" step="0.1" ref='$speed' value='${this.state.speed}' />
                    </div>
                </div>                
                <div class='row'>            
                    <label>${icon.replay} <span ref='$repeatStatus'>Repeat</span></label>
                    <div class='input' >
                        <input type='number' min="0" max="100" step="1" ref='$iteration' value='${this.state.iterationCount}' />
                    </div> 
                </div>
                <div class='row'>
                    <label>${icon.shuffle} Direction</label>
                    <div class='direction-buttons' ref='$direction' data-selected-direction='${this.state.direction}'>
                        <button type="button" data-value='normal' title='normal'>${icon.arrowRight}</button>
                        <button type="button" data-value='alternate' title='alternate'>${icon.alternate}</button>
                        <button type="button" data-value='reverse' title='reverse' style='transform: rotateY(180deg)'>${icon.arrowRight}</button>
                        <button type="button" data-value='alternate-reverse' title='alternate reverse' style='transform: rotateY(180deg)'>${icon.alternate_reverse}</button>
                    </div>
                </div>                                
            </div>
        `
    }

    initState() {

        var status = 'pause'
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

        var artboard = editor.selection.currentArtboard;
        if (artboard) {
            return artboard.getSelectedTimeline();
        }
    }

    updateData(obj) {
        this.setState(obj, false);
        var artboard = editor.selection.currentArtboard;
        if (artboard) {
            artboard.setTimelineInfo(obj);
        }
    }

    [CLICK('$playButtons button')] (e) {

        var status = e.$delegateTarget.attr('data-value')

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
        this.emit('first.timeline')
        editor.changeMode('SELECTION');
        this.emit('after.change.mode')
    }

    prev () {
        this.emit('prev.timeline')
        editor.changeMode('SELECTION');
        this.emit('after.change.mode')
    }
    
    next () {
        this.emit('next.timeline')
        editor.changeMode('SELECTION');
        this.emit('after.change.mode')           
    }
    
    last () {
        this.emit('last.timeline')
        editor.changeMode('SELECTION');
        this.emit('after.change.mode')             
    }    

    play () {
        this.emit('play.timeline', this.state.speed, this.state.iterationCount, this.state.direction);
    }

    pause () {
        this.emit('pause.timeline');
        editor.changeMode('SELECTION');
        this.emit('after.change.mode')
    }

    [EVENT('stopTimeline')] () {
        this.updateData({
            status: 'pause'
        })
    }
   
    [CLICK('$direction button')] (e) {
        this.updateData({
            direction: e.$delegateTarget.attr('data-value')
        })
        this.refresh();        
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
            text: this.state.iterationCount === 0 ? 'Infinite': 'Repeat'
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