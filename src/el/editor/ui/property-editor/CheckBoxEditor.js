import { BIND, CLICK, INPUT } from "el/base/Event";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class CheckBoxEditor extends EditorElement {

    initState() {
        var value = `${this.props.value}` === 'true';
        return {
            label: this.props.label || '',
            value
        }
    }

    template() {
        var { label, value } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return /*html*/`
            <div class='text-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }
                <input type='checkbox' ref='$checkbox' ${value ? 'checked': ''} />
            </div>
        `
    }

    getValue () {
        return this.state.value; 
    }

    [CLICK('$checkbox')] () {

        this.updateData({
            value: this.refs.$checkbox.checked()
        })
    }


    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }
}

registElement({ CheckBoxEditor })