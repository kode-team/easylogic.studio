import BaseColorPicker from '../BaseColorPicker'

import Hue from '../ui/control/Hue';
import Opacity from '../ui/control/Opacity'
import Palette from '../ui/ColorPalette'

export default class MiniColorPicker extends BaseColorPicker {

    template () {
        return `
            <div class='colorpicker-body'>
                <Palette />
                <div class="control">
                    <Hue />
                    <Opacity />
                </div>
            </div>
        `
    } 

    components() {
        return { 
            Hue, Opacity, Palette
        }
    }

}