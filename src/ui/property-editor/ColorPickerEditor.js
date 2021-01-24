import UIElement, { EVENT } from "@core/UIElement";
import Hue from "./colorpicker/ui/control/Hue";
import Opacity from "./colorpicker/ui/control/Opacity";
import ColorView from "./colorpicker/ui/control/ColorView";
import ColorInformation from "./colorpicker/ui/ColorInformation";
import Palette from "./colorpicker/ui/ColorPalette";
import ColorManagerV2 from "@core/ColorManagerV2";
import ColorAssetsEditor from "./ColorAssetsEditor";




export default class ColorPickerEditor extends UIElement {

    created ()  {
        this.manager = new ColorManagerV2();
    }

    initState () {

        const value = this.props.value || 'rgba(0, 0, 0, 1)'

        this.manager.initColor(value);

        return {
            key: this.props.key,
            value: this.manager.toString()
        }
    }

    updateData(opt = {}) {
        this.setState(opt, false);
        this.modifyColorPicker();
    }

    modifyColorPicker() {
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params);
    }

    /**
     * 
     * initialize color for colorpicker
     * 
     * @param {String|Object} newColor 
     * @param {String} format  hex, rgb, hsl
     */
    initColor(newColor, format) {
        this.manager.changeColor(newColor, format);

        this.refresh();
    }

    changeColor(newColor, format) {
        this.manager.changeColor(newColor, format);        

        this.refresh();

        this.updateData({
            value: this.manager.toColor()
        })
    }    

    [EVENT('selectColorAssets')] (key, color) {
        this.lastUpdateColor(color);
    }

    changeFormat (format) {        
        this.manager.changeFormat(format)

        this.setState({
            value: this.manager.toColor()
        }, false)        

        this.modifyColorPicker();
        this.changeEndColor();
    }


    lastUpdateColor(newColor, format) {
        this.manager.changeColor(newColor, format);        

        this.refresh();

        this.setState({
            value: this.manager.toColor()
        }, false)

        this.modifyColorPicker();        
        this.changeEndColor();
    }        

    changeEndColor() {
        this.parent.trigger(this.props.onchangeend, this.props.key, this.state.value, this.props.params);
    }


    refresh() {

        const color = this.manager.toColor()

        this.children.$palette.setValue(
            this.manager.hsv.s, 
            this.manager.hsv.v,
            this.manager.getHueColor()
        );
        this.children.$opacity.setValue(
            this.manager.rgb, 
            this.manager.alpha
        );
        this.children.$hue.setValue(
            this.manager.hsv.h
        );
        this.children.$colorview.setValue(
            color
        );

        this.children.$information.setValue();
    }


    components () {
        return {
            Hue,
            Opacity,
            ColorView,
            Palette,
            ColorInformation,
            ColorAssetsEditor,
            // CurrentColorSets,
            // ColorSetsChooser,
            // ContextMenu
        }
    }

    template () {
        return /*html*/`
        <div class='colorpicker sketch inline'>
            <div class='colorpicker-body'>
                <Palette ref='$palette' />
                <div class="control">
                    <Hue ref='$hue' />
                    <Opacity ref='$opacity' />
                    <div class="empty"></div>
                    <ColorView ref='$colorview' />
                </div>
                <ColorInformation ref='$information' />
                <ColorAssetsEditor ref='$colorAsset' key="colorAssets" onchange="selectColorAssets" /> 
            </div>
        </div>
      `;
    }

}