import UIElement, { EVENT } from "@sapa/UIElement";
import { LOAD, BIND } from "@sapa/Event";
import "./SelectEditor";
import "./RangeEditor";
import { registElement } from "@sapa/registerElement";

export default class OffsetPathListEditor extends UIElement {

    initState() {

        var [id, distance, rotateStatus, rotate ] = (this.props.value || '').split(',').map(it => it.trim())

        return {id, distance: distance || '0%', rotateStatus: rotateStatus || 'auto', rotate: rotate || '0deg' }
    }

    updateData(opt = {}) {
        this.setState(opt, false);
        this.modifyOffsetPath();
    }

    getValue () {
        return Object.keys(this.state).map(it => this.state[it]).join(','); 
    }

    refresh() {
        this.load();
    }

    setValue (value) {
        var [id, distance, rotateStatus, rotate ] = (value || '').split(',').map(it => it.trim())
        this.setState({
            id, distance, rotateStatus, rotate
        }, false)        
        this.refresh();
    }

    modifyOffsetPath() {
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params);
    }

    template() {
        return /*html*/`
            <div class='offset-path-editor'></div>
        `
    }

    getOptions () {
        var project = this.$selection.currentProject;

        var paths = {} 
        if (project) {
            project.allLayers
              .filter(it => it.is('svg-path', 'svg-polygon'))
              .forEach(it => {
                paths[it.id] = it 
              });    
        }

        return {
            options: Object.keys(paths).map(id => `${id}:${paths[id].name}`).join(','),
            paths
        }
    }

    [LOAD()] () {
        var obj = this.getOptions();
        var options = ',' + obj.options;
        var paths = obj.paths || {}

        var { id, rotateStatus, rotate, distance} = this.state 

        return /*html*/`
        <div>
            <div class='offset-path-item'>
                <object refClass="SelectEditor"  ref='$path' label='${this.$i18n('offset.path.list.editor.path')}' key="id" value="${id}" options="${options}" onchange='changeRangeEditor' />
            </div>
            <div class='offset-path-item'>
                <div>${this.$i18n('offset.path.list.editor.totalLength')}: <span ref='$totalLength'>${paths[id] && paths[id].totalLength || 0}</span></div>
            </div>
            <div class='offset-path-item'>
                <object refClass="RangeEditor"  ref='$distance' label='${this.$i18n('offset.path.list.editor.distance')}' min="0" max="100" value="${distance || '0%'}" key='distance' unit="%,px" onchange='changeRangeEditor' /> 
            </div>
            <div class='offset-path-item'>
                <object refClass="SelectEditor"  ref='$status' label='${this.$i18n('offset.path.list.editor.direction')}' key='rotateStatus' value="${rotateStatus}" options="auto,auto angle,angle,reverse,element" onchange='changeRangeEditor' /> 
            </div>
            <div class='offset-path-item'>
                <object refClass="RangeEditor"  ref='$rotate' label='${this.$i18n('offset.path.list.editor.rotate')}' min="0" max="2000" key='rotate' value='${rotate || '0deg'}' units="deg,turn" onchange='changeRangeEditor' /> 
            </div>     
        </div>           
        `
    }

    [BIND('$totalLength')] () {
        var { id} = this.state 
        var options = this.getOptions();

        var layer = options.paths[id] || { totalLength : 0} 
        var totalLength = layer.totalLength || 0

        return {
            innerHTML: `<span>${totalLength}</span>`
        }
    }


    [EVENT('changeRangeEditor')] (key, value) {
        this.updateData({
            [key]: value 
        })

        this.bindData('$totalLength');

    }



}

registElement({ OffsetPathListEditor })