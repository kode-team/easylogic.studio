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

export default class RingColorPicker extends BaseColorPicker {
 
    template () {
        return `
            <div class='colorpicker-body'>
                <ColorRing />
                <Palette />
                <div class="control">
                    <Value />
                    <Opacity />
                    <div class="empty"></div>
                    <ColorView />
                </div>
                <Information />
                <CurrentColorSets />
                <ColorSetsChooser />
                <ContextMenu />
            </div>
        `
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