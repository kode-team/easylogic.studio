import { LOAD, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export class ChartThemeEditor extends EditorElement {

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
            <div class='chart-theme-editor' ref='$body'></div>
        `
    }

    [LOAD('$body')] () {
        const label = this.props.label || ''
        const hasLabelClass = label ? 'has-label': '';
        return /*html*/`
            <div class="font-theme-group ${hasLabelClass}">
                <label class="label">${label}</label>
                <div>
                    <div>
                        <object refClass="FontSelectEditor"  
                            ref='$family' 
                            label='${this.$i18n('font.property.family')}' 
                            key="fontFamily" 
                            value="${this.state.value?.fontFamily}"
                            onchange="changeRangeEditor" 
                            compact="true"
                        />
                    </div>
                    <div>
                        <object refClass="ColorViewEditor"  
                            ref='$color' 
                            label='Background' 
                            key="backgroundColor" 
                            value="${this.state.value?.backgroundColor || 'white'}"
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

        if (key === 'fontSize' || key == 'fontWeight')  {
            value = value.value; 
        }

        this.updateData({
            [key]: value
        })
    }

}