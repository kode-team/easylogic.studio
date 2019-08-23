import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK, INPUT, BIND } from "../../../util/Event";
import icon from "../icon/icon";

export default class ColorViewEditor extends UIElement {

    initState() {
        return {
            removable: this.props.removable === 'true',            
            label: this.props.label,
            // params: this.props.params,
            color: this.props.color || 'rgba(0, 0, 0, 1)'
        }
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyColor();
    }

    getValue () {
        return this.state.color; 
    }

    setValue (color) {
        this.changeColor(color)
    }

    modifyColor() {
        this.parent.trigger(this.props.onchange, this.state.color, this.props.params);
    }

    changeColor (color) {
        this.setState({ color })
        this.refs.$miniView.cssText(`background-color: ${color}`);
        this.refs.$colorCode.val(color);
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
                        <div class='color-view' style="background-color: ${this.state.color}" ref='$miniView'></div>
                    </div>
                </div>
                <div class='color-code'>
                    <input type="text" ref='$colorCode' value='${this.state.color}' />
                </div>
                <button type='button' class='remove' ref='$remove' title='Remove'>${icon.close}</button>                
            </div>
        `
    }

    [BIND('$miniView')] () {
        return {
            style: {
                'background-color': this.state.color
            }
        }
    }

    [BIND('$colorCode')] () {
        return {
            value: this.state.color
        }
    }


    [CLICK("$preview")](e) {
        this.viewColorPicker();
    }

    viewColorPicker() {
        this.emit("showColorPickerPopup", {
            changeEvent: 'changeColorViewEditor',
            color: this.state.color
        }, {
            id: this.id
        });
    }


    [CLICK('$remove')] (e) {
        this.updateData({ color: ''})
    }    

    [INPUT("$el .color-code input")](e) {
        var color = e.$delegateTarget.value;
        this.refs.$miniView.cssText(`background-color: ${color}`);

        this.updateData({ color })
    }

    [EVENT("changeColorViewEditor")](color, data) {
        if (data.id === this.id) {
            this.refs.$miniView.cssText(`background-color: ${color}`);
            this.refs.$colorCode.val(color);
    
            this.updateData({ color })
        }
    }

}