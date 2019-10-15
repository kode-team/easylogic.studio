import UIElement from "../../../util/UIElement";
import { LOAD, INPUT, BIND, CLICK } from "../../../util/Event";
import colormatrix from "./colormatrix";



const COLUMN = 6; 

const sampleList = Object.keys(colormatrix).map(it => {
    return {title: it, values: colormatrix[it] }    
})

const splitReg = /[\b\t \,\n]/g;

export default class ColorMatrixEditor extends UIElement {

    initState() {
        return {
            values: this.normalize(this.props.values)
        }
    }

    template () {
        return /*html*/`
            <div class='small-editor color-matrix-editor' >
                <div ref='$body'></div>
                <div class='title'> Mix Color Template </div>
                <div class='color-matrix-template' ref='$sample'></div>
            </div>
        `
    }

    [BIND('$body')] () {
        return {

            cssText : `
                display: grid;
                grid-template-columns: repeat(${COLUMN}, 1fr);
                grid-column-gap: 2px;
                grid-row-gap: 2px;
                text-align: center; 
            `
        }
    }

    [LOAD('$sample')] () {
        return sampleList.map((it, index) =>  {
            return  /*html*/`<div class='sample-item' title='${it.title}' data-index="${index}">${it.title}</div>`
        })
    }

    normalize (str) {
        return str.trim().split(splitReg).filter(it => it).map(it  => +it);
    }

    [CLICK('$sample .sample-item')] (e) {
        var index = +e.$delegateTarget.attr('data-index')
        var sample = sampleList[index]

        this.updateData({
            values: this.normalize(sample.values)
        })

        this.load('$body');
    }

    [LOAD('$body')] () {

        var { values } = this.state

        var text = [ 'R', 'G', 'B', 'A']

        var a = values.map( (value, index) => {
            var h = '' 
            if (index % (COLUMN - 1) === 0) {
                h = `<div>${text[Math.floor(index/COLUMN)]}</div>`
            }
            var result = `
                ${h}
                <div class='number-editor'>
                    <input type="number" value="${value}" step="0.01" data-index="${index}" />
                </div>
            `

            return result; 
        })

        var header = `
            <div></div>
            <div>R</div>
            <div>G</div>
            <div>B</div>
            <div>A</div>
            <div>M</div>
        `

        return header + a;  
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.state.values, this.props.params)
    }

    [INPUT('$body input')] (e) {

        var $el = e.$delegateTarget;
        var index = +$el.attr('data-index')
        var value = +$el.value

        this.state.values[index] = value; 

        this.updateData();

    }
}