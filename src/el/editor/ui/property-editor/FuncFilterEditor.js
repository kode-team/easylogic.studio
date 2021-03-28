import UIElement, { EVENT } from "el/base/UIElement";
import { LOAD, SUBSCRIBE } from "el/base/Event";
import "./SelectEditor";
import "./TextEditor";
import "./NumberRangeEditor";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class FuncFilterEditor extends EditorElement {

    initState() {
       
        return {
            label: this.props.label || '',
            ...this.parse(this.props.value)
        }
    }

    parse (value) {
        var [type, ...values] = value.split(' ')

        if (type === 'linear') {
            var [slop, intercept] = values; 
        } else if (type === 'gamma') {
            var [amplitude, exponent, offset] = values; 
        }

        return {
            type, 
            values,
            slop,
            intercept,
            amplitude, 
            exponent, 
            offset
        }
    }

    template () {
        return /*html*/`<div class='small-editor func-filter' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { type,label } = this.state

        var hasLabel = !!label ? 'has-label' : ''

        return /*html*/`
        <object refClass="SelectEditor"  label="${label}" key="type" value="${this.state.type}" options="identity,table,discrete,linear,gamma" onchange="changeType" />
        <div class='func-filter-editor ${hasLabel}' ref='$container' data-selected-type='${type}'>
            ${label ? `<label></label>` : '' }
            <div data-type='identity'>
            </div>
            <div data-type='table'>
                <object refClass="TextEditor" label='tableValues' ref='$values' key='values' value="${this.state.values.join(' ')}" onchange="changeValues" />
            </div>
            <div data-type='linear'>
                ${['slop', 'intercept'].map(it => {
                    return /*html*/`
                        <div>
                            <object refClass="NumberRangeEditor"  label='${it}' ref='$${it}' key='${it}' value="${this.state[it]}" onchange="changeLinear" />
                        </div>                    
                    `
                }).join('')}
            </div>
            <div data-type='gamma'>
                ${['amplitude', 'exponent', 'offset'].map(it => {
                    return /*html*/`
                        <div>
                            <object refClass="NumberRangeEditor"  label='${it}' ref='$${it}' key='${it}' value="${this.state[it]}" onchange="changeGamma" />
                        </div>                    
                    `
                }).join('')}            
            </div>                                                
        </div>
    `
    }

    [SUBSCRIBE('changeType')] (key, type) {
        this.updateData({type});        
        this.refresh();
    }

    getValue() {
        switch(this.state.type) {
        case 'table':
        case 'discrete':
            return [this.state.type, ...this.state.values].join(' ')
        case 'linear':
            return [this.state.type, this.state.slop, this.state.intercept].join(' ')
        case 'gamma':
            return [this.state.type, this.state.amplitude, this.state.exponent, this.state.offset].join(' ')
        }

        return 'identity'
    }

    setValue (value) {
        this.setState({
            ...this.parse(value)
        })
    }

    [SUBSCRIBE('changeValues')] (key, value) {
        
        this.updateData({
            [key]: value.split(' ') 
        })
    }    

    [SUBSCRIBE('changeLinear')] (key, value) {
        this.updateData({
            [key]: value 
        })
    }

    [SUBSCRIBE('changeGamma')] (key, value) {
        this.updateData({
            [key]: value 
        })
    }    

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }
}

registElement({ FuncFilterEditor })