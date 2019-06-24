import UIElement, { EVENT } from '../../../util/UIElement';
import { BIND } from '../../../util/Event';

export default class ColorView extends UIElement {

    templateClass() {
        return 'color'
    }

    [BIND('$el')] () {
        return {
            style: {
                'background-color': this.parent.manager.toString('rgb')
            }
        }
    } 

    [EVENT('changeColor', 'initColor')] () { 
        this.refresh()
    } 
}
 