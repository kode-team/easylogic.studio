import { Length } from "el/editor/unit/Length";
import { POINTERSTART, BIND, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { isUndefined } from "el/sapa/functions/func";
import { END, MOVE } from "el/editor/types/event";
import { createComponent } from "el/sapa/functions/jsx";

export default class EllipseEditor extends EditorElement {

    parseValue(str = '50% 50%') {
        var radius = `50% 50%`, position = '';
        str = str || '50%'
        if (str.includes('at')) {
            [radius, position] = str.split('at').map(it => it.trim());
        } else {
            position = str.trim();
        }

        var [x, y] = position.split(' ')

        if (isUndefined(y)) {
            y = x;
        }

        x = Length.parse(x)
        y = Length.parse(y)

        var [radiusX, radiusY] = radius.split(' ');

        if (isUndefined(radiusY)) {
            radiusY = radiusX;
        }

        radiusX = Length.parse(radiusX)
        radiusY = Length.parse(radiusY)

        return {
            radiusX,
            radiusY,
            x,
            y
        }
    }

    initState() {
        return this.parseValue(this.props.value)
    }

    template() {
        return /*html*/`
        <div class='clip-path-editor circle-editor'>
            <div>
                ${createComponent("InputRangeEditor", {
            ref: '$rangeX',
            label: 'Radius X',
            key: 'radiusX',
            value: this.state.radiusX,
            min: 0,
            max: 100,
            step: 0.1,
            units: ["%"],
            onchange: 'changeRangeEditor'
        })}
            </div>
            <div>
            ${createComponent("InputRangeEditor", {
            ref: '$rangeY',
            label: 'Radius Y',
            key: 'radiusY',
            value: this.state.radiusY,
            min: 0,
            max: 100,
            step: 0.1,
            units: ["%"],
            onchange: 'changeRangeEditor'
        })}            
            </div>            
            <div class='drag-area' ref='$area'>
                <div class='drag-pointer' ref='$pointer' style='left: ${this.state.x};top: ${this.state.y};'></div>
                <div class='clip-area circle' ref='$clipArea'></div>
            </div>
        </div>
    `
    }


    [BIND('$clipArea')]() {
        return {
            style: {
                'clip-path': `${this.props.key}(${this.toClipPathValueString()})`
            }
        }
    }

    [POINTERSTART('$area') + MOVE() + END()](e) {

        this.areaRect = this.refs.$area.rect();
        this.startXY = e.xy;
    }

    move(dx, dy) {
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

        var left = Length.percent((x - this.areaRect.x) / this.areaRect.width * 100).round(1)
        var top = Length.percent((y - this.areaRect.y) / this.areaRect.height * 100).round(1)

        this.refs.$pointer.css({
            left, top
        })

        this.updateData({
            x: left,
            y: top
        })


        this.bindData('$clipArea')
    }

    toClipPathValueString() {

        var { x, y, radiusX, radiusY } = this.state;

        var results = `${x} ${y}`

        var radiusString = `${radiusX} ${radiusY}`;

        return `${radiusString} at ${results}`;
    }

    updateData(data) {
        this.setState(data)

        this.parent.trigger(this.props.onchange, this.props.key, this.toClipPathValueString(), this.props.params)
    }

    [SUBSCRIBE_SELF('changeRangeEditor')](key, value) {

        this.updateData({
            [key]: value.clone()
        })
    }
}