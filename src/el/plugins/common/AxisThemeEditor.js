import { LOAD, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export class AxisThemeEditor extends EditorElement {

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
            <div class='axis-theme-editor' ref='$body'></div>
        `
    }

    [LOAD('$body')] () {
        const label = this.props.label || ''
        const hasLabelClass = label ? 'has-label': '';
        const {
            title = {}, 
            labelAttr = {}, 
            color = 'black', 
            width
        } = this.state?.value || {}
        return /*html*/`
            <div class="axis-theme-group ${hasLabelClass}">
                <label class="label">${label}</label>
                <div>
                    <div>
                        <object refClass="FontThemeEditor" ref="$title" key="title" label="title" onchange="changeValue">
                            <property key="value" type="json">${JSON.stringify(title)}</property>
                        </object>
                    </div>      
                    <div>
                        <object refClass="FontThemeEditor" ref="$label" key="label" label="label" onchange="changeValue" >
                            <property key="label" type="json">${JSON.stringify(labelAttr)}</property>
                        </object>
                    </div>
                    <div>
                        <object refClass="ColorViewEditor" 
                            ref="$color" 
                            key="color" 
                            label="Color" 
                            onchange="changeValue" 
                            value="${color}" 
                            compact="true"
                        />
                    </div>
                    <div>
                        <object refClass="NumberRangeEditor" 
                            ref="$width" 
                            key="width" 
                            label="Width" 
                            min="0"
                            max="10"
                            step="1"
                            value="${width}"
                            onchange="changeValue" 
                            compact="true"                            
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

        if (key === 'width') {
            value = value.value; 
        }

        this.modifyData({
            [key]: value
        })
    }

}