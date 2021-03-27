import UIElement from '@sapa/UIElement';
import { BIND } from '@sapa/Event';

export default class ColorView extends UIElement {

    initState() {
        return {
            value: 'rgba(0, 0, 0, 1)'
        }
    }

    template() {
        return /*html*/`<div class='color'></div>`
    }

    [BIND('$el')] () {
        return {
            style: {
                'background-color': this.state.value
            }
        }
    } 

    setValue (value) {
        this.setState({
            value
        })
    }
}
 