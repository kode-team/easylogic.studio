import { LOAD, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export class LegendOptionsEditor extends EditorElement {

    initState() {
        return {
            key: this.props.key,
            params: this.props.params || '',
            label: this.props.label,
            value: this.props.value
        }
    }

    template () {
        return /*html*/`
            <div class='legend-options-editor' ref='$body'></div>
        `
    }

    [LOAD('$body')] () {
        const label = this.props.label || ''
        const hasLabelClass = label ? 'has-label': '';
        const {
            align = 'right', 
            showCheckbox = false,
            visible = true, 
        } = this.state?.value || {}
        return /*html*/`
            <div class="axis-theme-group ${hasLabelClass}">
                <label class="label">${label}</label>
                <div>
                    <div>
                        <object refClass="SelectEditor" 
                            ref="$align" 
                            key="align" 
                            label="align" 
                            onchange="changeValue" 
                            options="top,bottom,right,left",
                            value="${align}"
                            compact="true"
                        />
                    </div>      
                    <div>
                        <object refClass="CheckBoxEditor" 
                            ref="$showCheckbox" 
                            key="showCheckbox" 
                            label="checkbox" 
                            onchange="changeValue" 
                            value="${showCheckbox}"
                        />
                    </div>    
                    <div>
                        <object refClass="CheckBoxEditor" 
                            ref="$visible" 
                            key="visible" 
                            label="visible" 
                            onchange="changeValue" 
                            value="${visible}"
                        />
                    </div>                                        
                </div>
            </div>
        `
    }

    modifyData(obj) {
        this.parent.trigger(this.props.onchange, this.props.key, obj);
    }

    [SUBSCRIBE('changeValue')] (key, value) {

        this.modifyData({
            [key]: value
        })
    }

}