import BaseColorPicker from '../BaseColorPicker'

import Value from '../ui/control/Value'
import Opacity from '../ui/control/Opacity'
import ColorView from '../ui/control/ColorView'
import Information from '../ui/ColorInformation'
import ColorSetsChooser from '../ui/ColorSetsChooser'
import CurrentColorSets from '../ui/CurrentColorSets'
import ContextMenu from '../ui/CurrentColorSetsContextMenu'
import ColorRing from '../ui/ColorRing';
import Palette from '../ui/ColorPalette';
import { CLICK } from '../../util/Event';

export default class RingTabColorPicker extends BaseColorPicker {
    template () {
        return `
            <div class='colorpicker-body'>
                <div class='color-tab' ref="$tab">
                    <div class='color-tab-header' ref="$tabHeader">
                        <div class='color-tab-item active' item-id="color"><span >${this.opt.tabTitle}</span> Color</div>
                        <div class='color-tab-item' item-id="swatch">Swatch</div>
                        <div class='color-tab-item' item-id="colorset">Color Set</div>
                    </div>
                    <div class='color-tab-body' ref="$tabBody">
                        <div class='color-tab-content active'  item-id="color">
                            <ColorRing />
                            <Palette />
                            <div class="control">
                                <Value />
                                <Opacity />
                                <div class="empty"></div>
                                <ColorView />
                            </div>
                            <Information />
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
            Value,
            Opacity, 
            ColorView,
            ColorRing, 
            Palette, 
            Information,
            CurrentColorSets,
            ColorSetsChooser,
            ContextMenu
        }
    }
}