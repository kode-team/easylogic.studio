import UIElement, { EVENT } from '../../util/UIElement';
import { CLICK, LOAD } from '../../util/Event';
import { html } from '../../util/functions/func';

const DATA_COLORSETS_INDEX = 'data-colorsets-index';

export default class ColorSetsChooser extends UIElement {

    template () {
        return `<div class="color-chooser">
            <div class="color-chooser-container">
                <div class="colorsets-item colorsets-item-header">
                    <h1 class="title">Color Palettes</h1>
                    <span ref="$toggleButton" class="items">&times;</span>
                </div>
                <div ref="$colorsetsList" class="colorsets-list"></div>
            </div>
        </div>`
    }

    [EVENT('changeCurrentColorSets')] () {
        this.refresh()
    }

    [EVENT('toggleColorChooser')] () {
        this.toggle()
    }

    // loadable 
    [LOAD('$colorsetsList')] () {
        // colorsets 
        const colorSets = this.read('getColorSetsList');

        return html`
            <div>
                ${colorSets.map( (element, index) => {
                    return html`
                        <div class="colorsets-item" data-colorsets-index="${index}" >
                            <h1 class="title">${element.name}</h1>
                            <div class="items">
                                <div>
                                    ${element.colors.filter((color, i) => i < 5).map(color => {
                                        color = color || 'rgba(255, 255, 255, 1)';
                                        return  `<div class="color-item" title="${color}">
                                                <div class="color-view" style="background-color: ${color}"></div>
                                            </div>`
                                    })}
                                </div>
                            </div>
                        </div>`
                })}
            </div>
        `
    }

    show () {
        this.$el.addClass('open');
    }

    hide () {
        this.$el.removeClass('open');
    }

    toggle () {
        this.$el.toggleClass('open');
    }


    [CLICK('$toggleButton')] (e) {
        this.toggle();
    }

    [CLICK('$colorsetsList .colorsets-item')] (e, $dt) {
        if ($dt) {

            const index = parseInt($dt.attr(DATA_COLORSETS_INDEX));

            this.dispatch('setCurrentColorSets', index);

            this.hide();
        }
    }

    destroy () {
        super.destroy();

        this.hide();
    }

}
