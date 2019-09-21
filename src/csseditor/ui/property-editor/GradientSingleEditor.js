import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK, BIND } from "../../../util/Event";

export default class GradientSingleEditor extends UIElement {

    initState() { 
        return {
            index: this.props.index,
            image: this.props.image,
            color: 'rgba(0, 0, 0, 1)'
        }
    }

    updateData(opt = {}) {
        this.setState(opt, false);
        this.modifyValue(opt);
    }

    modifyValue(value) {
        this.parent.trigger(this.props.onchange, this.props.key, value, this.state.index);
    }

    setValue (obj) {
        this.setState({
            ...obj 
        })
    }

    [BIND('$miniView')] () {
        return {
            style: {
                'background-image': this.state.image, 
                'background-size': 'cover'
            }
        }
    }

    template() {

        return /*html*/`
            <div class='gradient-single-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' style="background-color: ${this.state.color}" ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `
    }


    [CLICK("$preview")](e) {
        this.viewGradientPopup();
    }

    viewGradientPopup() {

        this.emit("showGradientPickerPopup", {
            changeEvent: 'changeGradientSingle',
            gradient: this.state.image 
        }, {
            id: this.id
        });
    }

    [EVENT('changeGradientSingle')] (gradient, params) {
        if (params.id === this.id) {

            this.updateData({
                image: gradient 
            })

            this.refresh();
    
        }
      }
}