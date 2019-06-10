import UIElement from "../../../../../util/UIElement";
import { INPUT, LOAD, CLICK } from "../../../../../util/Event";
import icon from "../../../icon/icon";

export default class VarEditor extends UIElement {

    initState() {
        var values = this.props.value.split(';').filter(it => it.trim()).map(it => {
            const [key, value] = it.split(':')

            return {key, value}
        });

        return {
            params: this.props.params || '',
            values
        }
    }

    template() {
        return `
        <div class='var-editor var-list'>
            <div class='label' >
                <label>${this.props.title || ''}</label>
                <div class='tools'>
                    <button type="button" ref="$add" title="add Var">${icon.add}</button>
                </div>
            </div>
            <div class='var-list' ref='$varList'></div>
        </div>`;
    }

    [CLICK('$add')] () {
        this.state.values.push({
            key: '',
            value: '' 
        })

        this.refresh();

        this.updateData();
    }

    [LOAD('$varList')] () {
        return this.state.values.map( (it, index) => {
            return `
                <div class='var-item' >
                    <input type="text" data-type="key" value="${it.key}" data-index="${index}"  placeholder="variable" />
                    <input type="text" data-type="value" value="${it.value}" data-index="${index}"  placeholder="value" />
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
        var index = +e.$delegateTarget.attr('data-index')

        this.state.values.splice(index, 1);

        this.refresh();

        this.updateData();
    }

    [INPUT('$varList input')] (e) {
        var index = +e.$delegateTarget.attr('data-index')
        var type = e.$delegateTarget.attr('data-type')

        this.state.values[index][type] = e.$delegateTarget.value; 

        this.updateData()
    }

    updateData (data) {
        var value = this.state.values.map(it => {
            return `--${it.key}:${it.value}`
        }).join(';')

        this.parent.trigger(this.props.onchange, value, this.props.params)
    }

}