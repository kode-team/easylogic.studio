import UIElement, { EVENT } from "el/base/UIElement";
import { CLICK, BIND, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class BackgroundPositionEditor extends EditorElement {

    initState() { 
        return {
            index: this.props.index,
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
            repeat: this.props.repeat,
            size: this.props.size,
            blendMode: this.props.blendMode,
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
                'background-image': 'linear-gradient(to top right, black, white)',
                'background-repeat': this.state.repeat,
                'background-size': '7px 7px'
            }
        }
    }

    template() {

        return /*html*/`
            <div class='background-position-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' style="background-color: ${this.state.color}" ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `
    }


    [CLICK("$preview")](e) {
        this.viewBackgroundPositionPopup();
    }

    viewBackgroundPositionPopup() {
        this.emit("showBackgroundImagePositionPopup", {
            changeEvent: 'changeBackgroundPositionPattern',
            data: this.state 
        }, {
            id: this.id
        });
    }


    [SUBSCRIBE("changeBackgroundPositionPattern")](pattern, params) {
        if (params.id === this.id) {
            // this.refs.$miniView.cssText(`background-color: ${color}`);
            this.updateData({ ...pattern })
        }
    }    
}

registElement({ BackgroundPositionEditor })