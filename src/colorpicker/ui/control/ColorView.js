import UIElement, { EVENT } from '../../../util/UIElement';
import { BIND } from '../../../util/Event';

export default class ColorView extends UIElement {

    template() {
        return /*html*/`<div class='color'></div>`
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
 