import { LOAD, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export class ChartXAxisEditor extends EditorElement {

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
                <object refClass="TextEditor"  
                    ref='$title' 
                    label='Title' 
                    key="title" 
                    value="${this.state.value?.title}"
                    onchange="changeRangeEditor" 
                    compact="true"
                />
            </div>
            <div>
                <object refClass="CheckBoxEditor"  
                    ref='$rotateLabel' 
                    label='rotateLabel' 
                    key="rotateLabel" 
                    value="${this.state.value?.rotateLabel}"
                    onchange="changeRangeEditor" 
                    compact="true"
                />
            </div>

            <div>
                <object refClass="NumberRangeEditor"  
                    ref='$width' 
                    label='width' 
                    key="width" 
                    value="${this.state.value?.width}"
                    onchange="changeRangeEditor" 
                    compact="true"
                />
            </div>            
            <div>
                <object refClass="NumberRangeEditor"  
                    ref='$height' 
                    label='height' 
                    key="height" 
                    value="${this.state.value?.height}"
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