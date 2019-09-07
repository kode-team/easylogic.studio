import UIElement, { EVENT } from "../../../util/UIElement";
import { LOAD } from "../../../util/Event";
import SelectEditor from "./SelectEditor";
import { editor } from "../../../editor/editor";
import RangeEditor from "./RangeEditor";



export default class OffsetPathListEditor extends UIElement {

    components() {
        return {
            RangeEditor,
            SelectEditor
        }
    }

    initState() {

        var [id, distance, rotateStatus, rotate ] = (this.props.value || '').split(',').map(it => it.trim())

        return {id, distance, rotateStatus, rotate }
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
        console.log(this.getValue())
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params);
    }

    template() {
        return /*html*/`
            <div class='offset-path-editor'></div>
        `
    }

    getOptions () {
        var artboard = editor.selection.currentArtboard;

        var paths = {} 
        if (artboard) {
            artboard
            .allLayers
              .filter(it => it.is('svg-path', 'svg-polygon'))
              .filter(it => it['motion-based'])
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

        console.log({ id, rotateStatus, rotate, distance, options})
        var now = Date.now()

        return /*html*/`
        <div>
            <div class='offset-path-item'>
                <SelectEditor ref='$path' label='Path' key="id" value="${id}" options="${options}" onchange='changeRangeEditor' />
            </div>
            <div class='offset-path-item'>
                <div>Total Length: <span ref='$totalLength'>${paths[id] && paths[id].totalLength || 0}</span></div>
            </div>
            <div class='offset-path-item'>
                <RangeEditor ref='$distance' label='distance' min="0" max="100" value="${distance || '0%'}" key='distance' unit="%,px" onchange='changRangeEditor' /> 
            </div>
            <div class='offset-path-item'>
                <SelectEditor ref='$status' label='direction' key='rotateStatus' value="${rotateStatus}" options=",auto,reverse" onchange='changRangeEditor' /> 
            </div>
            <div class='offset-path-item'>
                <RangeEditor ref='$rotate' label='rotate' min="0" max="2000" key='rotate' value='${rotate || '0deg'}' units="deg,turn" onchange='changRangeEditor' /> 
            </div>     
        </div>           
        `
    }


    [EVENT('changeRangeEditor')] (key, value) {
        console.log(key, value);
        this.updateData({
            [key]: value 
        })

        var { id} = this.state 
        var options = this.getOptions();

        var layer = options.paths[id] || { totalLength : 0} 
        this.refs.$totalLength.text(layer.totalLength || 0)        

    }



}