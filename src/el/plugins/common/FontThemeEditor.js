import { LOAD, SUBSCRIBE } from "el/base/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/base/functions/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export class FontThemeEditor extends EditorElement {

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
            <div class='font-theme-editor' ref='$body'></div>
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
                        <object refClass="NumberRangeEditor"  
                            ref='$size' 
                            label='${this.$i18n('font.property.size')}' 
                            key="fontSize" 
                            value="${this.state.value?.fontSize}"
                            onchange="changeRangeEditor" 
                            compact="true"                            
                        />
                    </div>
                    <div>
                        <object refClass="NumberRangeEditor"  
                            ref='$weightRange' 
                            label='${this.$i18n('font.property.weight')}' 
                            key='fontWeight' 
                            value="${this.state.value?.fontWeight}" 
                            min="100"
                            max="900"
                            step="100"
                            unit="number" 
                            onchange="changeRangeEditor" 
                            compact="true"                            
                        />
                    </div>
                    <div>
                        <object refClass="ColorViewEditor"  
                            ref='$color' 
                            label='Color' 
                            key="color" 
                            value="${this.state.value?.color || 'black'}"
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