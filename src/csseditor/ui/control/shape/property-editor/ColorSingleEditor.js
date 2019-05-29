import UIElement, { EVENT } from "../../../../../util/UIElement";
import { CLICK } from "../../../../../util/Event";

export default class ColorSingleEditor extends UIElement {

    initState() {
        return {
            params: this.props.params,
            color: this.props.color || 'rgba(0, 0, 0, 1)'
        }
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyColor();
    }

    modifyColor() {
        this.parent.trigger(this.props.onchange, this.state.color, this.state.params);
    }

    changeColor (color) {
        this.setState({ color })
        this.refs.$miniView.cssText(`background-color: ${color}`);
    }

    template() {

        return `
            <div class='color-single-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' style="background-color: ${this.state.color}" ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `
    }


    [CLICK("$preview")]() {
        this.viewColorPicker();
    }

    viewColorPicker() {
        var rect = this.refs.$preview.rect();

        this.emit("showColorPicker", {
            changeEvent: 'changeColorSingleEditor',
            color: this.state.color,
            left: rect.left + 90,
            top: rect.top
        }, {
            id: this.id
        });
    }

    [EVENT("changeColorSingleEditor")](color, data) {
        if (data.id === this.id) {
            this.refs.$miniView.cssText(`background-color: ${color}`);

            this.updateData({ color })
        }
    }

}