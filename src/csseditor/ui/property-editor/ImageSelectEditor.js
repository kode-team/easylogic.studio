import UIElement, { EVENT } from "../../../util/UIElement";
import { LOAD, CLICK, VDOM } from "../../../util/Event";

export default class ImageSelectEditor extends UIElement {

    initState() {
        return {
            value: this.props.value
        }
    }

    template() {
        return `<div class='image-select-editor' ref='$body'></div>`
    }

    getValue () {
        return this.state.value; 
    }

    setValue (value) {
        this.setState({ value })
    }

    [LOAD('$body')] () {
        return `<img src="${this.state.value}" />`
    }

    [CLICK('$body')] () {
        // open image popup
        this.emit('showImageSelectPopup', {
            context: this, 
            changeEvent: 'changeImageSelectEditor',
            value: this.state.value 
        })
    }

    [EVENT('changeImageSelectEditor')] (value) {
        this.updateData({ value })
        this.refresh();
    }

    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}