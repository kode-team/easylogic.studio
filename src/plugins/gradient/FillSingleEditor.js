import { CLICK, BIND, SUBSCRIBE } from "el/sapa/Event";
import { SVGFill } from "el/editor/property-parser/SVGFill";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './FillSingleEditor.scss';

export default class FillSingleEditor extends EditorElement {

    initState() { 
        return {
            index: this.props.index,
            label: this.props.label,      
            simple: this.props.simple === 'true' ? true : false,       
            image: SVGFill.parseImage(this.props.value || this.props.image || 'transparent')
        }
    }

    get fillId () {
        return this.id + 'fill';
    }    

    updateData(opt = {}) {
        this.setState(opt, false);
        this.modifyValue(opt);
    }

    modifyValue(value) {
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.state.index);
    }

    getValue () {
        return this.state.image.toString()
    }

    setValue (value) {
        this.setState({
            image: SVGFill.parseImage(value) 
        })
    }

    [BIND('$fillView')] () {

        var image = this.state.image; 

        if (!image) return {innerHTML: ''}; 

        return {
            innerHTML: image.toSVGString(this.fillId)
        }
    }

    [BIND('$fillColor')] () {

        var image = this.state.image; 

        if (!image) return {fill: 'transparent'}; 

        return {
            fill: image.toFillValue(this.fillId)
        }
    }

    [BIND('$colors')] () {
        var image = this.state.image; 

        if (!image) return {fill: 'transparent'}; 

        var colors = image.type != 'url' ?  `${image.colorsteps[0].color}` : 'transparent'

        if (image.type.includes('linear') || image.type.includes('radial') ) {
            colors = image.colorsteps.map(it => {
                return /*html*/`<span class='color' style='background-color: ${it.color}' title='${it.color}'></span>`
            }).join('')
        }

        return {
            innerHTML: `<div> ${colors} </div>`
        }
    }

    template() {
        var { label, removable, simple } = this.state;
        var hasLabel = !!label ? 'has-label' : ''

        return /*html*/`
            <div class='elf--fill-single-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }            
                <div class="area">
                    <div class='preview' ref='$preview'>
                        <div class='mini-view'>

                            <svg class='color-view' ref='$miniView'>
                                <defs ref='$fillView'></defs>
                                <rect x="0" y="0" width="100%" height="100%" ref='$fillColor' fill='url(#${this.fillId})' />
                            </svg>
                        </div>
                    </div>
                    <div class='colors ${simple ? 'simple' : ''}' ref='$colors'></div>
                </div>
            </div>
        `
    }


    [CLICK()](e) {
        this.viewGradientPopup();
    }

    viewGradientPopup() {

        this.emit("showFillPickerPopup", {
            instance: this,
            key: this.props.key,
            changeEvent: 'changeFillSingle',
            image: this.state.image 
        }, null, this.$el.rect());
    }

    [SUBSCRIBE('changeFillSingle')] (image, params) {
        this.updateData({ image: SVGFill.parseImage(image) })

        this.refresh();
      }
}