
import { DOMDIFF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './GridLayoutEditor.scss';
import { createComponent } from "el/sapa/functions/jsx";
import { Layout } from "el/editor/types/model";

export default class GridLayoutEditor extends EditorElement {

    modifyData(key, value) {
        this.parent.trigger(this.props.onchange, key, value)
    }

    template () {
        return /*html*/`
            <div class='elf--grid-layout-editor' ref='$body' ></div>
        `
    }    

    [LOAD('$body') + DOMDIFF] () {

        const current = this.$selection.current;

        if (!current) return '';
        if (current.isLayout(Layout.GRID) === false) return "";

        return /*html*/`
            <div class='grid-layout-item'>
                ${createComponent("GridGapEditor" , {
                    label: this.$i18n('grid.layout.editor.column.gap'),
                    ref: '$columnGap',
                    key: 'grid-column-gap',
                    value: current['grid-column-gap'] || '',
                    onchange: 'changeKeyValue'
                })}
            </div>              
            <div class='grid-layout-item'>
                ${createComponent("GridGapEditor" , {
                    label: this.$i18n('grid.layout.editor.row.gap'),
                    ref: '$rowGap',
                    key: 'grid-row-gap',
                    value: current['grid-row-gap'] || '',
                    onchange: 'changeKeyValue'
                })}
            </div>
        `
    }



    [SUBSCRIBE_SELF('changeKeyValue')] (key, value, params) {

        this.modifyData(key, value, params);
    }
}