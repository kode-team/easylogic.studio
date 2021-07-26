import { CLICK, LOAD, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ClipPathEditor.scss';

export default class ClipPathEditor extends EditorElement {

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
            <div class='elf--clip-path-editor'></div>
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
            changeEvent: (data) => {
                this.updateData({
                    clippath: data['clip-path']
                })            
            },
            'clip-path': this.state.clippath
        });
    }
}