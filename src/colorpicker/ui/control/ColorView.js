import UIElement, { EVENT } from '../../../util/UIElement';

export default class ColorView extends UIElement {
    template () {
        return `<div class="color"></div>`
    }

    setBackgroundColor () {
        this.refs.$el.css("background-color", this.read('toRGB'));
    }

    refresh () {
        this.setBackgroundColor()
    }
    
    [EVENT('changeColor')] () { 
        this.refresh()
    } 

    [EVENT('initColor')] () { this.refresh() }    

}
 