import { LOAD, CLICK, CHANGE, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ImageSelectEditor.scss';

export default class ImageSelectEditor extends EditorElement {

    initState() {
        return {
            value: this.props.value
        }
    }

    template() {
        return /*html*/`
            <div class='elf--image-select-editor' ref='$body'></div>
        `
    }

    getValue () {
        return this.state.value; 
    }

    setValue (value) {
        this.setState({ value })
    }

    [LOAD('$body')] () {

        const project = this.$selection.currentProject;

        if (!project) return;

        return /*html*/`
            <div class='preview-container'>
                <img src="${project.getImageValueById(this.state.value) || this.state.value}" />
                <input type='file' ref='$file' accept="image/*" />
            </div>
            <div class='select-container'>
                <button type="button" ref='$select'>Select a image</button>
            <div>
        `
    }

    [CHANGE('$file')] (e) {

        var files = [...e.target.files];
        
        if (files.length) {
            this.emit('updateImageAssetItem', files[0], imageId => {
                this.trigger('changeImageSelectEditor', imageId);
            });
        }

    }

    [CLICK('$select')] () {
        
        this.emit('showImageSelectPopup', {
            context: this, 
            changeEvent: 'changeImageSelectEditor',
            value: this.state.value 
        })
    }

    [SUBSCRIBE('changeImageSelectEditor')] (value) {

        this.updateData({ value })
        this.refresh();
    }

    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}