import { INPUT, LOAD, CLICK, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './VarEditor.scss';

export default class VarEditor extends EditorElement {

    initState() {
        var values = this.props.value.split(';').filter(it => it.trim()).map(it => {
            let [key, value] = it.split(':')
            key = key.replace('--', '')
            return {key, value}
        });

        return {
            hideLabel: this.props['hide-label'] == 'true' ? true : false, 
            params: this.props.params || '',
            values
        }
    }

    template() {
        var labelClass = this.state.hideLabel ? 'hide' : '';
        return /*html*/`
        <div class='elf--var-editor var-list'>
            <div class='label ${labelClass}' >
                <label>${this.props.title || ''}</label>
                <div class='tools'>
                    <button type="button" ref="$add" title="add Var">${icon.add}</button>
                </div>
            </div>
            <div class='var-list' ref='$varList'></div>
        </div>`;
    }

    [SUBSCRIBE('add')] () {
        this.state.values.push({
            key: '',
            value: '' 
        })

        this.refresh();

        this.updateData();
    }

    [CLICK('$add')] () {
        this.trigger('add');
    }

    [LOAD('$varList')] () {
        return this.state.values.map( (it, index) => {
            return `
                <div class='var-item' >
                    <div>
                        <input type="text" data-type="key" value="${it.key}" data-index="${index}"  placeholder="variable" />
                    </div>
                    <div>
                        <input type="text" data-type="value" value="${it.value}" data-index="${index}"  placeholder="value" />
                    </div>
                    <div class="tools">
                        <button type="button" class="del" data-index="${index}">
                        ${icon.remove2}
                        </button>
                    </div>
                </div>
            `
        })
    }

    [CLICK('$varList .del')] (e) {
        var index = +e.$dt.attr('data-index')

        this.state.values.splice(index, 1);

        this.refresh();

        this.updateData();
    }

    [INPUT('$varList input')] (e) {
        var index = +e.$dt.attr('data-index')
        var type = e.$dt.attr('data-type')

        this.state.values[index][type] = e.$dt.value; 

        this.updateData()
    }

    updateData (data) {
        var value = this.state.values.map(it => {
            return `${it.key}:${it.value}`
        }).join(';')

        this.parent.trigger(this.props.onchange, value, this.props.params)
    }

}