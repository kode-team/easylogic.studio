import UIElement, { EVENT } from '../../../util/UIElement';
import { BIND } from '../../../util/Event';

export default class ColorView extends UIElement {

    templateClass() {
        return 'color'
    }

    [BIND('$el')] () {
        return {
            style: {
                'background-color': this.read('toRGB')
            }
        }
    }

    [EVENT('changeColor', 'initColor')] () { 
        this.refresh()
    } 
}
 