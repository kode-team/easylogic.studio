import UIElement, { EVENT } from "../../../util/UIElement";
import { LOAD, CLICK } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import icon from "../icon/icon";
import SelectEditor from "./SelectEditor";
import NumberInputEditor from "./NumberInputEditor";
import InputRangeEditor from "./InputRangeEditor";
import { isArray } from "../../../util/functions/func";

const i18n = editor.initI18n('grid.box.editor')

const REG_CSS_UNIT = /(auto)|(repeat\([^\)]*\))|(([\d.]+)(px|pt|fr|r?em|deg|vh|vw|%))/gi;


const makeOptionsFunction = (options) => {
    return () => {
        return options.split(',').map(it => {
            return `${it}:${i18n(it)}`
        }).join(',');
    }
}

const getLayoutItemOptions = makeOptionsFunction('none,auto,repeat,length')


export default class GridBoxEditor extends UIElement {

    components() {
        return {
            SelectEditor,
            NumberInputEditor,
            InputRangeEditor
        }
    }

    initState() {
        return {
            label: this.props.label,
            list: this.parseValue(this.props.value)
        }
    }

    setValue (value) {
        this.setState({
            list: this.parseValue(value)
        })
    }

    parseValue (value) {
        let arr = null; 

        var target = [] 

        while ((arr = REG_CSS_UNIT.exec(value)) !== null) {
            var text = arr[0];
            if (text === 'auto') {
                target.push({ type: 'auto', count:  0, value: '0px' })
            } else  if (text.includes('repeat'))  { 
                var tempArray = text.split('repeat(')[1].split(')')
                tempArray.pop();

                let [count, ...size] = tempArray.join('').split(',');

                target.push({ type: 'repeat', count, value: size.join(', ')  })
            } else {
                target.push({ type: 'length', count: 1, value: text })
            }
        }

        return target; 
    }

    getValue () {
        return this.state.list.map(it => {
            if (it.type === 'repeat') {
                return `repeat(${it.count}, ${it.value})`
            } else if (it.type === 'auto' || it.type === 'none') {
                return it.type;
            } else {
                return it.value
            }

        }).join(' ');
    }

    modifyData() {
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue())
    }

    makeItem (it, index) {
        return /*html*/`
            <div class='item' data-repeat-type='${it.type}' data-index='${index}' >
                <div class='repeat'>
                    <SelectEditor 
                        ref='$${index}-type' 
                        options="${getLayoutItemOptions()}" 
                        key="type" 
                        value="${it.type || 'auto'}" 
                        params="${index}" 
                        onchange="changeKeyValue" />
                </div>
                <div class='count'>
                    <NumberInputEditor 
                        ref='$${index}-count' 
                        key="count" 
                        value="${it.count}" 
                        params="${index}" 
                        max='1000'
                        onchange="changeKeyValue" />
                </div>                
                <div class='value'>
                    <InputRangeEditor 
                        ref='$${index}-value' 
                        key="value" 
                        value="${it.value}" 
                        params="${index}" 
                        units='auto,fr,px,em,%'
                        onchange="changeKeyValue" />
                </div>
                <div class='tools'>
                    <button type="button" class='copy'>${icon.copy}</button>                
                    <button type="button" class='remove'>${icon.remove2}</button>
                </div>
            </div>
        `
    }

    [LOAD('$list')] () {
        return this.state.list.map( (it, index) => {
            return this.makeItem(it, index);
        })
    }

    template () {
        return /*html*/`
            <div class='grid-box-editor' ref='$body' >
                <div class='grid-box-editor-item'>
                    <div class='item header'>
                        <div class='repeat'>
                            <label>${this.state.label} </label>
                            <button type='button' ref='$add'>${icon.add}</button>
                        </div>
                        <div class='count'>${i18n('count')}</div>
                        <div class='value'>${i18n('value')}</div>
                        <div class='tools'></div>
                    </div>
                    <div ref='$list'></div>
                </div>
            </div>
        `
    }

    [CLICK('$list .remove')] (e) {
        var index = +e.$delegateTarget.closest('item').attr('data-index')
        this.state.list.splice(index, 1);

        this.refresh();

        this.modifyData()        
    }

    [CLICK('$list .copy')] (e) {
        var index = +e.$delegateTarget.closest('item').attr('data-index')

        var newObj = clone(this.state.list[index]);
        this.state.list.splice(index, 0, newObj);

        this.refresh();

        this.modifyData()        
    }    

    [CLICK('$add')] () {
        this.trigger('add');
    }

    [EVENT('add')] () {
        this.state.list.push({ type: 'auto', count: 0, value: '0px'}) 
        this.refresh();
        
        this.modifyData()                
    }


    [EVENT('changeKeyValue')] (key, value, params) {

        var index = +params

        var item = this.state.list[index]

        if (item) {
            if (key ===  'type') {
                this.refs.$list.$(`[data-index="${index}"]`).attr('data-repeat-type', value)
            }
            item[key] = value; 
        }

        this.modifyData();
    }
}