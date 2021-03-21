import UIElement, { EVENT } from "@core/UIElement";
import { CLICK, LOAD } from "@core/Event";
import { registElement } from "@core/registerElement";

export default class ClipPathEditor extends UIElement {

    initState() {
        return {
            clippath: this.props.value
        }
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyClipPath();
    }

    getValue () {
        return this.state.clippath; 
    }

    setValue (clippath) {
        this.setState({clippath})
    }

    modifyClipPath() {
        this.parent.trigger(this.props.onchange, this.state.clippath, this.props.params);
    }

    template() {
        return /*html*/`
            <div class='clip-path-editor'></div>
        `
    }

    [LOAD()] () {
        var clippath = this.state.clippath
        return `
        <div class='clippath-item'>
            <div class='name'>${clippath}</div>
        </div>
        `
    }

    [CLICK()](e) {
        this.viewClipPathPicker();
    }


    viewClipPathPicker() {
        this.emit("showClipPathPopup", {
            changeEvent: 'changeClipPathEditor',
            'clip-path': this.state.clippath
        });
    }

    [EVENT('changeClipPathEditor')] (data) {

        this.updateData({
            clippath: data['clip-path']
        })
    }
}

registElement({ ClipPathEditor })