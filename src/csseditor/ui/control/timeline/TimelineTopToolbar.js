import UIElement, { EVENT } from "../../../../util/UIElement";
import { LOAD, CLICK, BIND, INPUT } from "../../../../util/Event";

export default class TimelineTopToolbar extends UIElement {
    
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
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
            iteration: 1,
            direction: 'normal'
        }
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

    [BIND('$direction') ] () {
        return {
            'data-selected-direction' : this.state.direction
        }
    }    

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }

}