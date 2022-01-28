import { CLICK, BIND, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './GradientSingleEditor.scss';
import { GradientType, RadialGradientType } from "el/editor/types/model";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";

export default class GradientSingleEditor extends EditorElement {

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

    setValue(obj) {
        this.setState({
            ...obj
        })
    }

    [BIND('$miniView')]() {
        const project = this.$selection.currentProject;

        if (this.state.image.type === GradientType.URL) {
            const imageUrl = project.getImageValueById(this.state.image.url) || this.state.image.url;

            return {
                style: {
                    'background-image': this.state.image.toString(imageUrl),
                    'background-size': 'cover',
                }
            }
        } else {
            return {
                style: {
                    'background-image': this.state.image,
                    'background-size': 'cover',
                }
            }            
        }
    }

    template() {

        return /*html*/`
            <div class='elf--gradient-single-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' ref='$miniView'></div>
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
            instance: this,
            changeEvent: 'changeGradientSingle',
            index: this.state.index,
            gradient: this.state.image
        }, null, this.$el.rect());
    }

    [SUBSCRIBE('changeGradientSingle')](image, params) {

        image = BackgroundImage.parseImage(image)
    
        const currentImage = this.$selection.current.getBackgroundImage(this.state.index)?.image;

        switch (currentImage.type) {
            case GradientType.RADIAL:
            case GradientType.REPEATING_RADIAL:
                image.reset({
                    radialPosition: currentImage.radialPosition || ['50%', '50%'],
                    radialType: currentImage.radialType || RadialGradientType.CIRCLE,
                })

                break;
            case GradientType.CONIC:
            case GradientType.REPEATING_CONIC:
                image.reset({
                    angle: currentImage.angle || 0,
                    radialPosition: currentImage.radialPosition || ['50%', '50%'],
                })
                break;
            case GradientType.LINEAR:
            case GradientType.REPEATING_LINEAR:
            case GradientType.STATIC:                
                image.reset({
                    angle: currentImage.angle || 0,
                })
                break;
        }

        console.log(image);

        this.updateData({ image })

        this.refresh();
    }
}