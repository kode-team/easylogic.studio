import Dom from '../../util/Dom'
import UIElement, { EVENT } from '../../util/UIElement';
import { CLICK, CONTEXTMENU, LOAD } from '../../util/Event';
import { html } from '../../util/functions/func';

export default class CurrentColorSets extends UIElement {

    template() {
        return `
            <div class="colorsets">
                <div class="menu" title="Open Color Palettes">
                    <button ref="$colorSetsChooseButton" type="button" class="color-sets-choose-btn arrow-button"></button>
                </div>
                <div ref="$colorSetsColorList" class="color-list"></div>
            </div>
        `
    }    
    
    [LOAD('$colorSetsColorList')] () {
        const currentColorSets  = this.parent.manager.getCurrentColorSets()
        const colors  = this.parent.manager.getCurrentColors()

        return html`<div class="current-color-sets">
            ${colors.map( (color, i) => {
                return `<div class="color-item" title="${color}" data-index="${i}" data-color="${color}">
                    <div class="empty"></div>
                    <div class="color-view" style="background-color: ${color}"></div>
                </div>`
            })}   
            ${currentColorSets.edit ? `<div class="add-color-item">+</div>` : ''}         
            </div>`
    }    

    addColor (color) {
        this.parent.manager.addCurrentColor(color);
        this.refresh();
    }

    [EVENT('changeCurrentColorSets')] () {
        this.refresh()
    }

    [EVENT('initColor')] () {
        this.refresh();
    }

    [CLICK('$colorSetsChooseButton')] (e) {
        this.emit('toggleColorChooser');
    }

    [CONTEXTMENU('$colorSetsColorList')] (e) {
        e.preventDefault();
        const currentColorSets  = this.parent.manager.getCurrentColorSets()

        if (!currentColorSets.edit) {
            return; 
        }

        const $target = Dom.create(e.target);
        
        const $item = $target.closest('color-item');

        if ($item) {
            const index = parseInt($item.attr('data-index'));

            this.emit('showContextMenu', e, index);
        } else {
            this.emit('showContextMenu', e);            
        }
    }

    [CLICK('$colorSetsColorList .add-color-item')] (e) {
        this.addColor(this.parent.getColor());
    }

    [CLICK('$colorSetsColorList .color-item')] (e, $dt) {
        this.parent.initColor($dt.attr('data-color'));
    }

}
