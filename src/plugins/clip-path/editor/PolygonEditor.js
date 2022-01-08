import { Length } from "el/editor/unit/Length";
import { POINTERSTART, LOAD, CLICK, BIND, PREVENT, ALT, SHIFT } from "el/sapa/Event";
import Dom from "el/sapa/functions/Dom";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { MOVE } from "el/editor/types/event";
import { createComponent } from "el/sapa/functions/jsx";
import polygon from "el/editor/preset/clip-path/polygon";


export default class PolygonEditor extends EditorElement {

    parseValue (str = '') {

        return str.split(',').filter(it => it.trim()).map(it => {
           var [x, y] = it.trim().split(' ')

           return { 
               x: Length.parse(x), 
               y: Length.parse(y) 
            }
        })
    }

    initState() {
        return {
            value: this.parseValue(this.props.value)
        }
    }

    template() {

        const polygonList = polygon.execute();

        return /*html*/`
        <div class='clip-path-editor polygon-editor'>
            ${createComponent('SelectEditor', {
                ref: '$polygonSelect',
                options: ['', ...polygonList.map(it => it.name)],
                onchange: (key, value) => {

                    const polygon = polygonList.find(it => it.name === value)

                    if (polygon) {
                        this.updateData({ value: this.parseValue(polygon.polygon) });
                        this.refresh();
                    }

                }
            })}
            <div class='drag-area' ref='$area'>
                <div class='pointer-list' ref='$list'></div>
                <div class='clip-area polygon' ref='$clipArea'></div>            
            </div>
        </div>
    `
    }

    [CLICK('$area') + PREVENT] (e) {

        if (Dom.create(e.target).is(this.refs.$area)) {

            this.areaRect = this.refs.$area.rect(); 
            var {x, y}  = e.xy; 
    
            this.appendValue({
                x: Length.px(x - this.areaRect.left).toPercent(this.areaRect.width),
                y: Length.px(y - this.areaRect.top).toPercent(this.areaRect.height)
            })
    
            this.refresh();
        }

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

    [CLICK('$area .drag-pointer') + SHIFT + PREVENT] (e) {
        var index = +e.$dt.attr('data-index');

        this.copyValue(index);

        this.refresh();
    }    

    [POINTERSTART('$area .drag-pointer') + MOVE()] (e) {

        this.selectedIndex = +e.$dt.attr('data-index');
        this.$target = e.$dt;
        this.areaRect = this.refs.$area.rect(); 
        this.startXY = e.xy; 
        
        this.$value = this.state.value[this.selectedIndex]
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

        var left = Length.percent((x - this.areaRect.x) / this.areaRect.width * 100)
        var top = Length.percent((y - this.areaRect.y) / this.areaRect.height * 100)

        this.$target.css({
            left, top 
        })

        this.updateValue(this.selectedIndex, {
            x: left,
            y: top
        })


        this.bindData('$clipArea')
    }

    toClipPathValueString () {
        return this.state.value.map(it => {
            return `${it.x.round(10)} ${it.y.round(10)}`
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
            x: x.clone().add(0.1),
            y: y.clone().add(0.1),
        });
        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)        
    }    

    updateValue (index, data) {
        this.state.value[index] = {...this.state.value[index], ...data}
        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)
    }

}