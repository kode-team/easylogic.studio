import UIElement from "../../../../../util/UIElement";
import { LOAD, BIND, CLICK } from "../../../../../util/Event";
import icon from "../../../icon/icon";

export default class IconListViewEditor extends UIElement {

    initState() {
        return {
            value: this.props.value
        }
    }

    template() {
        return `<div class='select-editor list-view-editor' ref='$body'></div>`
    }

    [BIND('$body')] () {
        return {
            'data-column': this.props.column || 1  
        }
    }

    [LOAD('$body')] () {
        return Object.keys(icon).map(key => {
            var html = icon[key]
            var selected = key === this.state.value ? 'selected' : ''

            return `<div class='list-view-item ${selected}'  data-key='${key}'>${html}</div>`
        })
    }

    getValue () {
        return this.state.value; 
    }

    setValue (value) {
        this.state.value = value; 
        this.refresh()
    }

    [CLICK('$body .list-view-item')] (e) {
        var key = e.$delegateTarget.attr('data-key');

        e.$delegateTarget.onlyOneClass('selected')

        this.updateData({
            value: key
        })
    }

    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}