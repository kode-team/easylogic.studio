import UIElement, { EVENT } from "../../../../util/UIElement";
import { CHANGE_COLORSTEP, CHANGE_EDITOR, CHANGE_SELECTION, CHANGE_LAYER } from "../../../types/event";
import { UNIT_PX, UNIT_EM, UNIT_PERCENT, EMPTY_STRING } from "../../../../util/css/types";
import { CLICK, INPUT, CHANGE, LOAD } from "../../../../util/Event";
import { html } from "../../../../util/functions/func";
import { editor } from "../../../../editor/editor";

export default class GradientInfo extends UIElement {

    template () { 
        return `
            <div class='gradient-info'>
                <div class="form-item" ref="$colorsteps"></div>
            </div>
        ` 
    }

    getUnitSelect (step) {

        return `
        <select class='unit' colorstep-id="${step.id}">
            <option value='percent' ${step.isPercent ? 'selected' : EMPTY_STRING}>%</option>
            <option value='px' ${step.isPx ? 'selected' : EMPTY_STRING}>px</option>
            <option value='em' ${step.isEm ? 'selected' : EMPTY_STRING}>em</option>
        </select>
        `
    }

    [LOAD('$colorsteps')] () {

        var item = editor.selection.image;
        if (!item) return EMPTY_STRING;

        var colorsteps = image.colorsteps;

        return html`<div class='step-list' ref="$stepList">
                    ${colorsteps.map( step => {
                        var cut = step.cut ? 'cut' : EMPTY_STRING;      
                        var unitValue = step.getUnitValue(this.getMaxValue());
                        return `
                            <div class='color-step ${step.selected ? 'selected' : EMPTY_STRING}' colorstep-id="${step.id}" >
                                <div class="color-cut">
                                    <div class="guide-change ${cut}" colorstep-id="${step.id}"></div>
                                </div>                                
                                <div class="color-view">
                                    <div class="color-view-item" style="background-color: ${step.color}" colorstep-id="${step.id}" ></div>
                                </div>                            
                                <div class="color-code">
                                    <input type="text" class="code" value='${step.color}' colorstep-id="${step.id}"  />
                                </div>
                                <div class="color-unit ${step.getUnit()}">
                                    <input type="number" class="percent" min="0" max="100" step="0.1"  value="${unitValue.percent}" colorstep-id="${step.id}"  />
                                    <input type="number" class="px" min="0" max="1000" step="1"  value="${unitValue.px}" colorstep-id="${step.id}"  />
                                    <input type="number" class="em" min="0" max="500" step="0.1"  value="${unitValue.em}" colorstep-id="${step.id}"  />
                                    ${this.getUnitSelect(step)}
                                </div>                       
                                <div class="tools">
                                    <button type="button" class='remove-step' colorstep-id="${step.id}" >&times;</button>
                                </div>
                            </div>
                        `
                    })}
                </div>`
    }

    refresh () {
        this.load()
    }

    [EVENT(
        CHANGE_COLORSTEP,
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )] () { this.refresh(); }

    selectStep (e) {
        editor.selection.select(e.$delegateTarget.attr('colorstep-id'));
    }    

    [CLICK('$colorsteps .color-view-item')] (e) {
        this.selectStep(e)
    }

    [INPUT('$colorsteps input.code')] (e) {

        var color = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = editor.get(id)

        if (step) {
            step.color = color; 
            editor.send(CHANGE_COLORSTEP, step)

            this.refs.$stepList.$(`.color-view-item[colorstep-id="${step.id}"]`).css({
                'background-color': color 
            })
        }

    }

    getMaxValue (layer) {
        return editor.config.get('step.width') || 400;
    }

    [CHANGE('$colorsteps select.unit')] (e) {

        var unit = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = editor.get( id)

        if (step) {
            step.changeUnit(unit, this.getMaxValue())
            editor.send(CHANGE_COLORSTEP, step )

            var $parent = e.$delegateTarget.parent();
            $parent.removeClass(UNIT_PERCENT, UNIT_PX, UNIT_EM).addClass(unit);
        }        
    }

    [INPUT('$colorsteps input.percent')] (e) {

        var percent = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = editor.get( id)

        if (step) {
            step.percent = +percent;
            step.changeUnit(step.unit, this.getMaxValue())

            editor.send(CHANGE_COLORSTEP, step);

        }
    }

    [INPUT('$colorsteps input.px')] (e) {
        var px = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = this.get( id)

        if (step) {
            step.px = +px; 
            step.changeUnit(step.unit, this.getMaxValue());

            editor.send(CHANGE_COLORSTEP, step);       
        }
    }
    
    [INPUT('$colorsteps input.em')] (e) {

        var em = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = editor.get( id)

        if (step) {
            step.em = +em; 
            step.changeUnit(step.unit, this.getMaxValue());
            editor.send(CHANGE_COLORSTEP, step);
        }
    }    

    [CLICK('$colorsteps .remove-step')] (e) {
        var item = editor.selection.currentImage
        if (!item) return; 

        var id = e.$delegateTarget.attr('colorstep-id')
        var step = editor.get(id);
        if (step) {
            step.remove();
        }
        editor.send(CHANGE_LAYER, id);
    }


    [CLICK('$colorsteps .guide-change')] (e) {
        var id = e.$delegateTarget.attr('colorstep-id');
        var item = editor.get( id);

        if (item) {
            item.cut = !item.cut; 
            editor.send(CHANGE_COLORSTEP, item)
        }

    }    

}