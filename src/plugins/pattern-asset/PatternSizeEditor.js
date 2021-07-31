
import { CLICK, BIND, SUBSCRIBE } from "el/sapa/Event";
import { Pattern } from "el/editor/property-parser/Pattern";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { Length } from "el/editor/unit/Length";

import './PatternSizeEditor.scss';

export default class PatternSizeEditor extends EditorElement {

    initState() { 
        return {
            index: this.props.index,
            x: Length.parse(this.props.x),
            y: Length.parse(this.props.y),
            width: Length.parse(this.props.width),
            height: Length.parse(this.props.height),
            lineWidth: Length.parse(this.props.linewidth),
            lineHeight: Length.parse(this.props.lineheight),            
            backColor: this.props.backcolor,
            foreColor: this.props.forecolor,
            blendMode: this.props.blendmode,
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

        let obj = {
            ...this.state,
        }        

        if (this.state.width.value > 80) {
            obj.width = Length.px(80);
            obj.x = Length.px(obj.x.value / this.state.width.value/80)
        }

        if (this.state.height.value > 80) {
            obj.height = Length.px(80);
            obj.y = Length.px(this.state.y.value / this.state.height.value/80)
        }        


        const pattern = Pattern.parse(obj);

        return {
            cssText: pattern.toCSS()
        }
    }

    template() {

        return /*html*/`
            <div class='elf--pattern-size-editor'>
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
        this.emit("showPatternInfoPopup", {
            changeEvent: (pattern) => {
                this.updateData({ ...pattern })                
            },
            data: this.state,
            instance: this
        });
    }
}