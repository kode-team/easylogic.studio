import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK, INPUT, BIND, FOCUS, BLUR } from "../../../util/Event";
import icon from "../icon/icon";

export default class ColorViewEditor extends UIElement {

    initState() {
        return {
            removable: this.props.removable === 'true',            
            label: this.props.label,
            value: this.props.value || 'rgba(0, 0, 0, 1)'
        }
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyColor();
    }

    getValue () {
        return this.state.value; 
    }

    setValue (value) {
        this.changeColor(value)
    }

    modifyColor() {
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params);
    }

    changeColor (value) {
        this.setState({ value })
        this.refs.$miniView.cssText(`background-color: ${value}`);
        this.refs.$colorCode.val(value);
    }

    refresh () {
        this.refs.$miniView.cssText(`background-color: ${this.state.value}`);
        this.refs.$colorCode.val(this.state.value);
    }

    template() {
        var { label, removable } = this.state;
        var hasLabel = !!label ? 'has-label' : ''
        var isRemovable = removable ? 'is-removable' : '';        
        return /*html*/`
            <div class='color-view-editor ${hasLabel} ${isRemovable}'>
                ${label ? `<label>${label}</label>` : '' }            
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' style="background-color: ${this.state.value}" ref='$miniView'></div>
                    </div>
                </div>
                <div class='color-code'>
                    <input type="text" ref='$colorCode' value='${this.state.value}' />
                </div>
                <button type='button' class='remove' ref='$remove' title='Remove'>${icon.remove}</button>                
            </div>
        ` 
    }

    [BIND('$miniView')] () {
        return {
            style: {
                'background-color': this.state.value
            }
        }
    }

    [BIND('$colorCode')] () {
        return {
            value: this.state.value
        }
    }

    [FOCUS('$colorCode')] (e) {
        this.refs.$colorCode.addClass('focused');
    }

    [BLUR('$colorCode')] (e) {
        this.refs.$colorCode.removeClass('focused');
    }

    [CLICK("$preview")](e) {
        this.viewColorPicker();
    }

    viewColorPicker() {
        this.emit("showColorPickerPopup", {
            changeEvent: 'changeColorViewEditor',
            color: this.state.value
        }, {
            id: this.id
        });
    }


    [CLICK('$remove')] (e) {
        this.updateData({ value: ''})
    }    

    [INPUT("$el .color-code input")](e) {
        var color = e.$delegateTarget.value;
        this.refs.$miniView.cssText(`background-color: ${color}`);

        this.updateData({ value: color })
    }

    [EVENT("changeColorViewEditor")](color, data) {
        if (data.id === this.id) {
            this.refs.$miniView.cssText(`background-color: ${color}`);
            this.refs.$colorCode.val(color);
    
            this.updateData({ value: color })
        }
    }

}