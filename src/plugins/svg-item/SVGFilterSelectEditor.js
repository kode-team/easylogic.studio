import { LOAD, CHANGE, BIND, DEBOUNCE, CLICK, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class SVGFilterSelectEditor extends EditorElement {

    initState() {
        var value = this.props.value;

        return {
            options: [],
            label: this.props.label || '',
            value
        }
    }

    template() {
        var { label } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return /*html*/`
            <div class='svg-filter-select-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }
                <select ref='$options'></select>
                <button type='button' class='open thin' ref='$open' title='Open SVG Filter Editor'>${icon.fullscreen}</button>
                <button type='button' class='remove thin' ref='$remove' title='Remove'>${icon.remove}</button>
            </div>
        `
    }


    [CLICK('$remove')] (e) {
        this.updateData({
            value: ''
        })
    }

    [CLICK('$open')] (e) {
        var value = this.state.value;

        if (value.includes('id')) {
            var currentProject = this.$selection.currentProject
            var index = currentProject.getSVGFilterIndex(value)

            if (index > -1) {
                this.trigger('openSVGFilterPopup', index);
            }
        }
    }

    getValue () {
        return this.state.value; 
    }

    setValue (value) {
        this.setState({ value })
    }

    refresh(reload = false) {
        this.load();
    }

    [BIND('$options')] () {
        return {
            'data-count': this.state.options.length.toString()
        }
    }

    [LOAD('$options')] () {



        var current = this.$selection.currentProject;
        var options = '' 
        
        if (current) {
          options = current.svgfilters.map(it => it.id)
          options = options.length ? ',' + options.join(',') : '';
        }

        options += ',-,new';

        options = options.split(',');

        var arr = options.map(it => {


            var value = it; 
            var label = it; 

            if (value.includes(":")) {
                var [value, label] = value.split(':')
            }

            if (label === '') {
                label = this.props['none-value'] ? this.props['none-value'] : ''
            } else if (label === '-') {
                label = '----------'
                value = ''; 
            }
            var selected = value === this.state.value ? 'selected' : '' 
            return `<option ${selected} value="${value}">${label}</option>`
        })

        return arr; 
    }

    setOptions (options = '') {
        this.setState({ 
            options: options.split(this.state.splitChar).map(it => it.trim()) 
        })
    }

    sendMessage (type) {
        if (type === 'new') {
            this.emit('addStatusBarMessage', this.$i18n('svgfilter.select.editor.message.create'));
        } else if (type === '-') {
            this.emit('addStatusBarMessage', this.$i18n('svgfilter.select.editor.message.select'));
        } else {
            this.emit('addStatusBarMessage', '');
        }
    }

    [CHANGE('$options')] () {

        var value = this.refs.$options.value 

        if (value == 'new') {

            this.emit('addSVGFilterAssetItem', (index, id) => {
                this.updateData({ value: id })
        
                this.refresh();
        
                this.trigger('openSVGFilterPopup', index);
        
              })
        } else if (value === '-') {
            
        } else {
            this.updateData({ value })
        }
 
    }


    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }

    [SUBSCRIBE('refreshSVGArea') + DEBOUNCE(1000)] () {
        this.load('$options')
    }


    [SUBSCRIBE('openSVGFilterPopup')](index) {
        this.emit('refreshSVGFilterAssets');
        this.emit('refreshSVGArea');
        var currentProject = this.$selection.currentProject || { svgfilters: [] } 
    
        var svgfilter = currentProject.svgfilters[index];
    
        this.emit("showSVGFilterPopup", {
            changeEvent: 'changeSVGFilterEditorRealUpdate',
            preview: false,
            index,
            filters: svgfilter.filters 
        });
    }
    
    
    [SUBSCRIBE('changeSVGFilterEditorRealUpdate')] (params) {
        var project = this.$selection.currentProject
    
        if (project) {
            project.setSVGFilterValue(params.index, {
                filters: params.filters
            });
        
            this.emit('refreshSVGFilterAssets');
            this.emit('refreshSVGArea');
        }
    }    
}