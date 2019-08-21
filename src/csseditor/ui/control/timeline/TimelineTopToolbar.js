import UIElement, { EVENT } from "../../../../util/UIElement";
import { LOAD, CLICK, BIND, INPUT } from "../../../../util/Event";

export default class TimelineTopToolbar extends UIElement {
    
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
                <div class='row'>
                    <label>Speed</label>
                    <div class='play-buttons' ref='$play' data-selected-speed='${this.state.speed}'>
                        <button type="button" data-value='0.5'>0.5x</button>
                        <button type="button" data-value='1'>1x</button>
                        <button type="button" data-value='2'>2x</button>
                        <button type="button" data-value='3'>3x</button>
                    </div>
                </div>
                <div class='row'>
                    <label>Iteration</label>
                    <div class='input' >
                        <input type='number' min="1" max="100" step="1" ref='$iteration' value='${this.state.iteration}' />
                    </div>
                </div>
                <div class='row'>
                    <label>Direction</label>
                    <div class='direction-buttons' ref='$direction' data-selected-direction='${this.state.direction}'>
                        <button type="button" data-value='normal'>D</button>
                        <button type="button" data-value='alternate'>A</button>
                        <button type="button" data-value='reverse'>R</button>
                        <button type="button" data-value='alternate-reverse'>AR</button>
                    </div>
                </div>                                
            </div>
        `
    }

    initState() {
        return {
            speed: 1,
            iteration: 1,
            direction: 'normal'
        }
    }

    [CLICK('$play button')] (e) {
        this.setState({
            speed: +e.$delegateTarget.attr('data-value')
        })

        this.play()
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

    play () {
        this.emit('play.timeline', this.state.speed, this.state.iteration, this.state.direction);
    }

    [BIND('$play') ] () {
        return {
            'data-selected-speed' : this.state.speed
        }
    }

    [BIND('$direction') ] () {
        return {
            'data-selected-direction' : this.state.direction
        }
    }    

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }

}