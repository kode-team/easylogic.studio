import UIElement from "../../../../../util/UIElement";
import { LOAD, INPUT, BIND } from "../../../../../util/Event";
import { WHITE_STRING } from "../../../../../util/css/types";

export default class InputArrayEditor extends UIElement {

    initState() {
        var values = this.props.values.split(WHITE_STRING).map(it => +it)
        return {
            values,
            column: this.props.column
        }
    }

    template () {
        return `<div class='small-editor input-array-editor' ref='$body' ></div>`
    }

    [BIND('$body')] () {
        return {
            style: {
                'display': 'grid',
                'grid-template-columns': `repeat(${this.state.column}, 1fr)`
            }
        }
    }

    [LOAD('$body')] () {

        var { values } = this.state

        
        return values.map( (value, index) => {
            return `
                <div class='number-editor'>
                    <input type="number" value="${value}" step="0.01" data-index="${index}" />
                </div>
            `
        })
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.state.values, this.props.params)
    }

    [INPUT('$body input')] (e) {

        var $el = e.$delegateTarget;
        var index = +$el.attr('data-index')
        var value = +$el.value

        this.state.values[index] = value; 

        this.updateData();

    }
}