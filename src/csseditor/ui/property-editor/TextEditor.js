import UIElement from "../../../util/UIElement";
import { BIND, INPUT } from "../../../util/Event";

export default class TextEditor extends UIElement {

    initState() {
        var value = this.props.value;

        return {
            label: this.props.label || '',
            value
        }
    }

    template() {
        var { label } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return /*html*/`
            <div class='text-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }
                <input type='text' ref='$text' />
            </div>
        `
    }

    getValue () {
        return this.refs.$options.value; 
    }

    [BIND('$text')] () {
        return {
            'value': this.state.value
        }
    }

    [INPUT('$text')] () {
        this.updateData({
            value: this.refs.$text.value 
        })
    }


    updateData (data) {
        this.setState(data)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}