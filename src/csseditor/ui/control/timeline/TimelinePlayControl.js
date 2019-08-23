import UIElement from "../../../../util/UIElement";
import { CLICK, BIND } from "../../../../util/Event";
import icon from "../../icon/icon";

export default class TimelinePlayControl extends UIElement {
    
    template() {
        return /*html*/`
            <div class='timeline-play-control' data-status='pause'>
                <div class='row'>
                    <button type="button" data-value='prev' class='prev'>${icon.skip_prev}</button>
                    <button type="button" data-value='rewind' class='rewind'>${icon.fast_rewind}</button>                    
                    <button type="button" data-value='play' class='play'>${icon.play}</button>
                    <button type="button" data-value='pause' class='pause'>${icon.pause}</button>
                    <button type="button" data-value='forward' class='forward'>${icon.fast_forward}</button>                    
                    <button type="button" data-value='next' class='next'>${icon.skip_next}</button>
                </div>                           
            </div>
        `
    }

    initState() {
        return {
            speed: 1
        }
    }

    [CLICK('$el button')] (e) {

        var status = e.$delegateTarget.attr('data-value')

        this.$el.attr('data-status', status);
    }

    play () {
        this.emit('play.timeline', this.state.speed, this.state.iteration, this.state.direction);
    }

    [BIND('$play') ] () {
        return {
            'data-selected-speed' : this.state.speed
        }
    }

}