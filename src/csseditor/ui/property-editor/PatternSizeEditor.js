import UIElement, { EVENT } from "../../../util/UIElement";
import { CLICK, BIND } from "../../../util/Event";
import { Pattern } from "../../../editor/css-property/Pattern";

export default class PatternSizeEditor extends UIElement {

    initState() { 
        return {
            index: this.props.index,
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
            backColor: this.props.backColor,
            foreColor: this.props.foreColor,
            type: this.props.type,
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

        const pattern = Pattern.parse(this.state);

        return {
            cssText: pattern.toCSS()
        }
    }

    template() {

        return /*html*/`
            <div class='pattern-size-editor'>
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


    [EVENT("changeBackgroundPositionPattern")](pattern, params) {
        if (params.id === this.id) {
            this.updateData({ ...pattern })
        }
    }    
}