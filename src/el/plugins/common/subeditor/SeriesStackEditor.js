import { LOAD, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export class SeriesStackEditor extends EditorElement {

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
            <div style='display: grid; grid-template-columns: 60px 1fr; grid-column-gap: 2px;'>
                <label>Stack</label>
                <div>
                    <div>
                        <object refClass="CheckBoxEditor"  
                            ref='$stack' 
                            label='stack' 
                            key="stack" 
                            value="${typeof this.state.value?.stack === 'boolean' ? this.state.value?.stack : false }"
                            onchange="changeRangeEditor"
                            compact="true"
                        />
                    </div>        
                    <div>
                        <object refClass="SelectEditor"  
                            ref='$type' 
                            label='type' 
                            key="type" 
                            value="${this.state.value?.type || 'normal'}"
                            options="normal,percent"
                            onchange="changeRangeEditor" 
                            compact="true"
                        />
                    </div>
                    <div>
                        <object refClass="CheckBoxEditor"  
                            ref='$connector' 
                            label='connector' 
                            key="connector" 
                            value="${this.state.value?.connector}"
                            onchange="changeRangeEditor" 
                            compact="true"
                        />
                    </div>
                </div>
            </div>
    `
    }

    getValue () {
        return this.state.value;
    }

    updateStackData(value) {
        this.setState({ value }, false);

        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }

    updateData(obj) {
        this.setState({
            value: {
                ...(this.state.value || {}),
                ...obj 
            }
        }, false);

        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }    

    [SUBSCRIBE('changeRangeEditor')] (key, value) {

        if (key === 'stack') {
            this.updateStackData(value);
        } else {
            this.updateData({
                [key]: value
            })
        }

    }

}