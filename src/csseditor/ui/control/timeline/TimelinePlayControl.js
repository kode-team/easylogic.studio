import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, INPUT, BIND } from "../../../../util/Event";
import icon from "../../icon/icon";

export default class TimelinePlayControl extends UIElement {
    
    template() {
        return /*html*/`
            <div class='timeline-play-control' >
                <div class='row'>
                    <div class='play-buttons' ref='$playButtons' data-status='${this.state.status}'>
                        <button type="button" data-value='play' class='play'>${icon.play}</button>
                        <button type="button" data-value='pause' class='pause'>${icon.pause}</button>                
                        <button type="button" data-value='prev' class='prev'>${icon.skip_prev}</button>
                        <button type="button" data-value='rewind' class='rewind'>${icon.fast_rewind}</button>                    
                        <button type="button" data-value='forward' class='forward'>${icon.fast_forward}</button>                    
                        <button type="button" data-value='next' class='next'>${icon.skip_next}</button>
                    </div>
                </div>
                <div class='row'>            
                    <label title='Speed'>${icon.speed} Speed</label>
                    <div class='input speed-number' >
                        <input type='number' min="0.1" max="10" step="0.1" ref='$speed' value='${this.state.speed}' />
                    </div>
                </div>                
                <div class='row'>            
                    <label>${icon.replay} Repeat</label>
                    <div class='input' >
                        <input type='number' min="1" max="100" step="1" ref='$iteration' value='${this.state.iteration}' />
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
        return {
            status: 'pause',
            speed: 1,
            iteration: 1,
            direction: 'normal'            
        }
    }

    [CLICK('$playButtons button')] (e) {

        var status = e.$delegateTarget.attr('data-value')

        this.setState({ status })

        if (status === 'play') {
            this.play();
        } else if (status === 'pause') {
            this.pause();
        }


    }

    play () {
        this.emit('play.timeline', this.state.speed, this.state.iteration, this.state.direction);
    }

    pause () {
        this.emit('pause.timeline');
    }

    [EVENT('stopTimeline')] () {
        this.setState({
            status: 'pause'
        })
    }
   
    [CLICK('$direction button')] (e) {
        this.setState({
            direction: e.$delegateTarget.attr('data-value')
        })
    }    

    [INPUT('$iteration')] (e) {
        this.setState({
            iteration: +this.refs.$iteration.value
        })
    }

    [INPUT('$speed')] (e) {
        this.setState({
            speed: +this.refs.$speed.value 
        })
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