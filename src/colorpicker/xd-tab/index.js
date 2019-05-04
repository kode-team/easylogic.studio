import BaseColorPicker from '../BaseColorPicker'

import Information from '../ui/ColorInformation'
import Palette from '../ui/ColorPalette'
import ColorSetsChooser from '../ui/ColorSetsChooser'
import CurrentColorSets from '../ui/CurrentColorSets'
import ContextMenu from '../ui/CurrentColorSetsContextMenu'
import Hue from '../ui/control/VerticalHue'
import Opacity from '../ui/control/VerticalOpacity'
import { CLICK } from '../../util/Event';

export default class XDTabColorPicker extends BaseColorPicker {

    template () { 
        return `
            <div class='colorpicker-body'>
                <div class='color-tab xd' ref="$tab">
                    <div class='color-tab-header' ref="$tabHeader">
                        <div class='color-tab-item active' item-id="color"><span >${this.opt.tabTitle}</span> Color</div>
                        <div class='color-tab-item' item-id="swatch">Swatch</div>
                        <div class='color-tab-item' item-id="colorset">Color Set</div>
                    </div>
                    <div class='color-tab-body' ref="$tabBody">
                        <div class='color-tab-content active'  item-id="color">
                            <palette />
                            <div class="control">
                                <Hue />
                                <Opacity />
                            </div>
                            <information />
                        </div>
                        <div class='color-tab-content' item-id="swatch">
                            <CurrentColorSets />
                            <ContextMenu />
                        </div>
                        <div class='color-tab-content' item-id="colorset">
                            <ColorSetsChooser />
                        </div>                        
                    </div>

            </div>
        `
    }


    [CLICK('$tabHeader .color-tab-item')] (e, $dt) {
        if (!$dt.hasClass('active')) {
            var selectedItem = this.refs.$tabHeader.$('.active');
            if (selectedItem) selectedItem.removeClass('active');
            $dt.addClass('active')

            var selectedItem = this.refs.$tabBody.$('.active');
            if (selectedItem) selectedItem.removeClass('active');
            var activeItem = this.refs.$tabBody.$(`[item-id='${$dt.attr('item-id')}']`);
            if (activeItem) activeItem.addClass('active');
        }

    }    

    components() {
        return { 
            Hue,
            Opacity,
            Palette,  
            Information,
            CurrentColorSets,
            ColorSetsChooser,
            ContextMenu
        }
    }

}