import { Length } from "el/editor/unit/Length";
import { POINTERSTART, MOVE, LOAD, CLICK, BIND, PREVENT, ALT } from "el/base/Event";
import "../RangeEditor";
import Dom from "el/base/Dom";
import icon from "el/editor/icon/icon";
import { EditorElement } from "../../common/EditorElement";
import { registElement } from "el/base/registElement";


export default class PolygonEditor extends EditorElement {

    parseValue (str = '') {

        var maxWidth = 220;
        var maxHeight = 220;

        return str.split(',').filter(it => it.trim()).map(it => {
           var [x, y] = it.trim().split(' ')

           return { 
               x: Length.parse(x).toPx(maxWidth), 
               y: Length.parse(y).toPx(maxHeight) 
            }
        })
    }

    initState() {
        return {
            value: this.parseValue(this.props.value)
        }
    }

    template() {

        return `
        <div class='clip-path-editor polygon-editor'>
            <div class='drag-area' ref='$area'>
                <div class='pointer-list' ref='$list'></div>
                <div class='clip-area polygon' ref='$clipArea'></div>            
            </div>
            <div class='pointer-input' ref='$inputList'></div>
        </div>
    `
    }
    
    [LOAD('$inputList')] () {
        return this.state.value.map( (it, index) => {
            return /*html*/`
            <div class='pointer-item' data-index="${index}">
                <div class='input-item'>
                    <label>X</label><input type='number' class='x' value="${it.x.value.toString()}" /><span>%</span>
                </div>
                <div class='input-item'>
                    <label>Y</label><input type='number' class='y' value="${it.y.value.toString()}" /><span>%</span>
                </div>
                <div class='tools'>
                    <button type="button" class='copy' data-index="${index}">${icon.copy}</button>
                    <button type="button" class='remove' data-index="${index}">${icon.remove2}</button>
                </div>
            </div>
            `
        })
    }

    [CLICK('$area') + PREVENT] (e) {

        if (Dom.create(e.target).is(this.refs.$area)) {

            this.areaRect = this.refs.$area.rect(); 
            var {x, y}  = e.xy; 
    
            this.appendValue({
                x: Length.px(x - this.areaRect.left),
                y: Length.px(y - this.areaRect.top)
            })
    
            this.refresh();
        }

    }

    [CLICK('$inputList .pointer-item .remove')] (e) {
        var index = +e.$dt.attr('data-index')

        this.removeValue(index);

        this.refresh()
    }

    [CLICK('$inputList .pointer-item .copy')] (e) {
        var index = +e.$dt.attr('data-index')

        this.copyValue(index);

        this.refresh()
    }    

    [BIND('$clipArea')] () {
        return {
            style : {
                'clip-path' : `polygon(${this.toClipPathValueString()})`
            }
        }
    }


    [LOAD('$list')] () {

        return this.state.value.map( (it, index) => {
            var className = [
                index === 0? 'first' : '',
                index === this.state.value.length-1 ? 'last' : ''
            ].filter(it => it).join(' ')
            return `<div class='drag-pointer ${className}' data-index="${index.toString()}" style='left: ${it.x};top: ${it.y};'></div>`
        })
    }

    [CLICK('$area .drag-pointer') + ALT + PREVENT] (e) {
        var index = +e.$dt.attr('data-index');

        this.removeValue(index);

        this.refresh();
    }

    [POINTERSTART('$area .drag-pointer') + MOVE()] (e) {

        this.selectedIndex = +e.$dt.attr('data-index');
        this.$target = e.$dt;
        this.areaRect = this.refs.$area.rect(); 
        this.startXY = e.xy; 
        
        this.$value = this.state.value[this.selectedIndex]

        var $inputList = this.refs.$inputList;
        this.$x = $inputList.$(`.pointer-item[data-index="${this.selectedIndex}"] input.x`)
        this.$y = $inputList.$(`.pointer-item[data-index="${this.selectedIndex}"] input.y`)
    }

    move (dx, dy) {
        var x = this.startXY.x + dx;
        var y = this.startXY.y + dy;  

        if (this.areaRect.x > x) {
            x = this.areaRect.x; 
        } else if (this.areaRect.right < x) {
            x = this.areaRect.right; 
        }

        if (this.areaRect.y > y) {
            y = this.areaRect.y; 
        } else if (this.areaRect.bottom < y) {
            y = this.areaRect.bottom; 
        }        

        var left = Length.px(x - this.areaRect.x)
        var top = Length.px(y - this.areaRect.y)

        this.$target.css({
            left, top 
        })

        this.updateValue(this.selectedIndex, {
            x: left,
            y: top
        })


        var maxWidth = 220;
        var maxHeight = 220;

        this.$x.val(left.toPercent(maxWidth).round(10).value)
        this.$y.val(top.toPercent(maxHeight).round(10).value)

        this.bindData('$clipArea')
    }

    toClipPathValueString () {

        var maxWidth = 220;
        var maxHeight = 220;

        return this.state.value.map(it => {
            return `${it.x.toPercent(maxWidth).round(10)} ${it.y.toPercent(maxHeight).round(10)}`
        }).join(',');
    }

    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)
    }

    appendValue(data) {
        this.state.value.push(data);
        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)        
    }

    removeValue(index) {
        this.state.value.splice(index, 1);
        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)        
    }    

    copyValue(index) {

        var {x, y}= this.state.value[index]

        this.state.value.splice(index+1, 0, {
            x: Length.px(x.value + 10),
            y: Length.px(y.value + 10)
        });
        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)        
    }    

    updateValue (index, data) {
        this.state.value[index] = {...this.state.value[index], ...data}
        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)
    }

}

registElement({ PolygonEditor })