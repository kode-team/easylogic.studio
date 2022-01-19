import { CLICK, INPUT, BIND, FOCUS, BLUR, FOCUSIN, FOCUSOUT } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ColorViewEditor.scss';
import Color from "el/utils/Color";
import { clone, isBoolean } from "el/sapa/functions/func";

export default class ColorViewEditor extends EditorElement {

    initState() {
        const value = this.props.value || 'rgba(0, 0, 0, 1)';
        const compact = isBoolean(this.props.compact) ? this.props.compact : this.props.compact === 'true';
        const mini = isBoolean(this.props.mini) ? this.props.mini : this.props.mini === 'true';

        return {
            label: this.props.label,
            value,
            compact,
            mini,
            color: Color.parse(value),
            colorFocus: false,
            opacityFocus: false,
        }
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyColor();
    }

    updateEndData(opt = {}) {
        this.setState(opt);
        this.modifyEndColor();
    }

    getValue() {
        return this.state.value;
    }

    setValue(value) {
        this.changeColor(value)
    }

    modifyColor() {
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params);
    }

    modifyEndColor() {
        this.parent.trigger(this.props.onchangeend, this.props.key, this.state.value, this.props.params);
    }


    changeColor(value) {
        this.setState({
            value,
            color: Color.parse(value)
        })
    }

    get alpha() {
        return this.state.color.a * 100;
    }

    get hexColor() {
        return Color.formatWithoutAlpha(this.state.color, 'hex');
    }

    get fullColor() {
        return Color.format(this.state.color, this.state.color.type);
    }

    refresh() {
        this.refreshColorView();
        this.refs.$colorCode.val(this.state.value);
        this.refs.$opacityCode.val(this.alpha);
    }


    refreshColorView() {
        this.bindData('$miniView1')
        this.bindData('$miniView2')
    }

    template() {
        var { label, compact, mini } = this.state;
        var hasLabel = !!label ? 'has-label' : ''
        var hasCompact = !!compact ? 'compact' : ''
        var hasMini = !!mini ? 'mini' : ''

        return /*html*/`
            <div class='elf--color-view-editor ${hasLabel} ${hasCompact} ${hasMini}'>
                ${label ? `<label>${label}</label>` : ''}            
                <div class='color-code' ref="$container">
                    <div class='preview' ref='$preview'>
                        <div class='mini-view'>
                            <div class='color-view' ref='$miniView1'></div>
                            <div class='color-view' ref='$miniView2'></div>
                        </div>
                    </div>                
                    <div class="color-input">
                        <input type="text" ref='$colorCode' value='${this.state.value}' tabIndex="1" />
                    </div>
                    <div class="opacity-input">                    
                        <input type="number" ref='$opacityCode' value='${this.alpha}' tabIndex="2" max="100" min="0" step="0.1" />
                    </div>                    
                </div>
            </div>
        `
    }

    [BIND('$el')]() {
        return {
            class: {
                'focused': this.state.colorFocus || this.state.opacityFocus,
            }
        }
    }

    [BIND('$miniView1')]() {
        return {
            style: {
                'background-color': this.hexColor
            }
        }
    }

    [BIND('$miniView2')]() {
        return {
            style: {
                'background-color': this.fullColor
            }
        }
    }

    [BIND('$colorCode')]() {
        return {
            value: this.props.format ? this.hexColor : this.state.value
        }
    }

    [BIND('$opacityCode')]() {
        return {
            value: this.alpha
        }
    }

    [FOCUSIN('$colorCode')](e) {
        this.setState({
            colorFocus: true
        })
        this.refs.$colorCode.select();
    }

    [FOCUSOUT('$colorCode')](e) {
        this.setState({
            colorFocus: false
        })
    }

    [FOCUSIN('$opacityCode')](e) {
        this.setState({
            opacityFocus: true
        })
        this.refs.$opacityCode.select();
    }

    [FOCUSOUT('$opacityCode')](e) {
        this.setState({
            opacityFocus: false
        })
    }

    [CLICK("$preview")](e) {
        this.viewColorPicker();
    }

    viewColorPicker() {

        this.emit("showColorPickerPopup", {
            target: this,
            changeEvent: (color) => {
                this.updateData({ value: color, color: Color.parse(color) })
            },
            changeEndEvent: (color) => {
                this.updateEndData({ value: color, color: Color.parse(color) })
            },
            color: this.state.value
        }, null, this.$el.rect());
    }


    [CLICK('$remove')](e) {
        this.updateData({ value: '' })
    }

    [INPUT("$el .color-input input")](e) {
        var color = e.$dt.value;
        this.updateData({
            value: color,
            color: Color.parse(color)
        })

        this.refreshColorView();
    }

    [INPUT("$el .opacity-input input")](e) {
        var opacity = +e.$dt.value;

        opacity = Math.max(0, Math.min(100, opacity));

        const color = Color.parse(this.state.value);
        color.a = opacity / 100;

        const value = Color.format(color, color.type)
        this.updateData({
            value: value,
            color
        })

        this.refreshColorView();
    }

}