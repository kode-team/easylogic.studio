import UIElement from "../../../util/UIElement";
import { POINTERSTART, MOVE, BIND } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";

export default class MediaProgressEditor extends UIElement {

    initState() {
        return {
            start: +(this.props.start || 0),
            end: +(this.props.end || 1),
        }
    }

    template() {
        return /*html*/`
            <div class='media-progress-editor'>
                <div class='progress-bar' ref='$progress'></div>
                <div class='bar' ref='$bar'></div>                
                <div class='drag-item start' ref='$start'></div>
                <div class='drag-item end' ref='$end'></div>
            </div>
        `
    }

    [POINTERSTART('$start') + MOVE('moveStart')] (e) {
        this.rect = this.refs.$progress.rect();
        this.pos = Length.parse(this.refs.$start.css('left')).toPx(this.rect.width);
        this.max = Length.parse(this.refs.$end.css('left')).toPx(this.rect.width);
    }

    moveStart (dx, dy) {
        var realPos = Math.min(this.max.value, Math.max(0, this.pos.value + dx))
        this.state.start = realPos / this.rect.width;
        this.bindData('$start');
        this.bindData('$bar')        
    }

    [BIND('$start')] () {
        return {
            style: {
                left: Length.percent((this.state.start) * 100)
            }
        }
    }

    [POINTERSTART('$end') + MOVE('moveStartForEnd')] (e) {
        this.rect = this.refs.$progress.rect();
        this.pos = Length.parse(this.refs.$end.css('left')).toPx(this.rect.width);
        this.min = Length.parse(this.refs.$start.css('left')).toPx(this.rect.width);
        this.max = Length.px(this.rect.width);
    }

    moveStartForEnd (dx, dy) {
        var realPos = Math.max(this.min.value, Math.min(this.max.value, this.pos.value + dx))
        this.state.end = realPos / this.rect.width;
        this.bindData('$end');
        this.bindData('$bar')
    }

    [BIND('$end')] () {
        return {
            style: {
                left: Length.percent((this.state.end) * 100)
            }
        }
    }

    [BIND('$bar')] () {

        return {
            style: {
                left: Length.percent((this.state.start) * 100),
                width: Length.percent((this.state.end - this.state.start) * 100)
            }
        }
    }    

    getValue () {
        const { start, end} = this.state; 
        return `${start}:${end}`; 
    }

    setValue (value) {
        const [ start, end ] = value.split(':');
        this.setState({ 
            start: Number(start), 
            end: Number(end) 
        })
    }
}