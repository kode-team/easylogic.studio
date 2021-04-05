import { LOAD, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { SeriesStackEditor } from "./subeditor/SeriesStackEditor";



export class ChartSeriesEditor extends EditorElement {

    components() {
        return {
            SeriesStackEditor
        }
    }

    initState() {
        return {
            key: this.props.key,
            params: this.props.params || '',
            label: this.props.label,
            value: this.props.value || {}
        }
    }

    template () {
        return /*html*/`
            <div class='chart-series-editor' ref='$body'></div>
        `
    }

    [LOAD('$body')] () {
        return /*html*/`
            <div>
                <object refClass="SeriesStackEditor"  
                    ref='$stack' 
                    label='stack' 
                    key="stack" 
                    value="${this.state.value?.selectable || false}"
                    onchange="changeRangeEditor" 
                    compact="true"
                >       
                    <property name="value" valueType="json" >${JSON.stringify(this.state.value?.stack || {})}</property>
                </object>
            </div>
            <div>
                <object refClass="CheckBoxEditor"  
                    ref='$selectable' 
                    label='Selectable' 
                    key="selectable" 
                    value="${this.state.value?.selectable || false}"
                    onchange="changeRangeEditor" 
                    compact="true"
                />
            </div>
            <div>
                <object refClass="NumberRangeEditor"  
                    ref='$barWidth' 
                    label='barWidth' 
                    key="barWidth" 
                    value="${this.state.value?.barWidth}"
                    onchange="changeRangeEditor" 
                    compact="true"
                />
            </div>
            <div>
                <object refClass="CheckBoxEditor"  
                    ref='$diverging' 
                    label='diverging' 
                    key="diverging" 
                    value="${this.state.value?.diverging}"
                    onchange="changeRangeEditor" 
                    compact="true"
                />
            </div>
            <div>
                <object refClass="CheckBoxEditor"  
                    ref='$colorByPoint' 
                    label='colorByPoint' 
                    key="colorByPoint" 
                    value="${this.state.value?.colorByPoint}"
                    onchange="changeRangeEditor" 
                    compact="true"
                />
            </div>
    `
    }

    getValue () {
        return this.state.value;
    }

    updateData(obj) {
        this.setState({
            value: {
                ...this.state.value ,
                ...obj 
            }
        }, false);

        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }

    [SUBSCRIBE('changeRangeEditor')] (key, value) {
        this.updateData({
            [key]: value
        })
    }

}