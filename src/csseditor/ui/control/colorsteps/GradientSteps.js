import UIElement, { EVENT } from '../../../../util/UIElement';
import Dom from '../../../../util/Dom';
import { 
    CHANGE_COLORSTEP,  
    CHANGE_EDITOR,
    CHANGE_SELECTION,
    CHANGE_LAYER
} from '../../../types/event';
import { UNIT_PX, UNIT_EM, UNIT_PERCENT, EMPTY_STRING } from '../../../../util/css/types';
import { CHANGE, INPUT, POINTERSTART, CLICK, SHIFT, IF, LOAD, MOVE, END } from '../../../../util/Event';
import { editor } from '../../../../editor/editor';
import { LinearGradient } from '../../../../editor/image-resource/LinearGradient';
import { Length } from '../../../../editor/unit/Length';

export default class GradientSteps extends UIElement {

    template () { 
        return `
            <div class='gradient-steps'>
                <div class="hue-container" ref="$back"></div>            
                <div class="hue" ref="$steps">
                    <div class='step-list' ref="$stepList"></div>
                </div>
            </div>
        ` 
    }

    getStepPosition (step) {
        var {min, max} = this.getMinMax() 
        
        var left = this.refs.$steps.offset().left

        min -= left;
        max -= left;

        if (step.isPx) {
            return step.px;
        } 

        return min + (max - min) * (step.percent / 100);
    }

    getUnitName (step) {
        var unit = step.unit || UNIT_PERCENT

        if ([UNIT_PX, UNIT_EM].includes(unit)) {
            return unit; 
        }

        return UNIT_PERCENT
    }

    getUnitSelect (step) {

        return `
        <select class='unit' data-colorstep-id="${step.id}">
            <option value='percent' ${step.isPercent ? 'selected' : EMPTY_STRING}>%</option>
            <option value='px' ${step.isPx ? 'selected' : EMPTY_STRING}>px</option>
            <option value='em' ${step.isEm ? 'selected' : EMPTY_STRING}>em</option>
        </select>
        `
    }

    getMaxValue () {
        return editor.config.get('step.width') || 400;
    }

    // load 후에 이벤트를 재설정 해야한다. 
    [LOAD('$stepList')] () {
        var item = editor.selection.image;
        if (!item) return EMPTY_STRING;

        if (!image.isGradient()) return EMPTY_STRING;

        return image.colorsteps.map(step => {

            var cut = step.cut ? 'cut' : EMPTY_STRING; 
            var unitValue = step.getUnitValue(this.getMaxValue());
            return `
                <div 
                    class='drag-bar ${step.selected ? 'selected' : EMPTY_STRING}' 
                    id="${step.id}"
                    style="left: ${this.getStepPosition(step)}px;"
                >   
                    <div class="guide-step step" style=" border-color: ${step.color};background-color: ${step.color};"></div>
                    <div class='guide-line' 
                        style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), ${step.color} 10%) ;"></div>
                    <div class="guide-change ${cut}" data-colorstep-id="${step.id}"></div>
                    <div class="guide-unit ${step.getUnit()}">
                        <input type="number" class="percent" min="-100" max="100" step="0.1"  value="${unitValue.percent}" data-colorstep-id="${step.id}"  />
                        <input type="number" class="px" min="-100" max="1000" step="1"  value="${unitValue.px}" data-colorstep-id="${step.id}"  />
                        <input type="number" class="em" min="-100" max="500" step="0.1"  value="${unitValue.em}" data-colorstep-id="${step.id}"  />
                        ${this.getUnitSelect(step)}
                    </div>       
                </div>
            `
        })
    }

    isShow() {

        var item = editor.selection.image;
        if (!item) return false; 

        return item.isGradient()
    }

    refresh () {
        this.$el.toggle(this.isShow())

        var item = editor.selection.image;
        if (item && item.isGradient()) {
            this.load()
            this.setColorUI()
        }        
    }

    setColorUI() {
        this.setBackgroundColor()
    }

    setBackgroundColor() {

        var item = editor.selection.image;
        if (item && item.isGradient()) {
            this.refs.$stepList.css( 'background-image', LinearGradient.toLinearGradient(item) )   
        }
    }

    /* slide 영역 min,max 구하기  */
    getMinMax() {
        var min = this.refs.$steps.offsetLeft(); 
        var width = this.refs.$steps.width();
        var max = min + width;

        return {min, max, width}
    }

    /* 현재 위치 구하기  */ 
    getCurrent () {
        var {min, max} = this.getMinMax()
        var {x} = editor.config.get('pos')
 
        var current = Math.min(Math.max(min, x), max)

        return current
    }

    /**
     * 마우스 이벤트로 현재 위치 및 percent 설정, 전체  gradient 리프레쉬 
     * 
     * @param {*} e 
     */
    refreshColorUI (isUpdate) {
        
        var {min, max} = this.getMinMax()

        var current = this.getCurrent()

        if (this.currentStep) {
            var posX = Math.max(min, current)
            var px = posX - this.refs.$steps.offsetLeft();

            if (editor.config.get('bodyEvent').ctrlKey) {
                px = Math.floor(px);    // control + drag is floor number 
            }
            this.currentStepBox.px('left', px)

            var item = editor.get( this.currentStepBox.attr('id'));

            if (item) {

                // item.px = px; 
                var maxValue = max - min; 
                var percent = Length.px(px).toPercent(maxValue);
                var em = Length.px(px).toEm(maxValue);

                item.reset({px, percent, em})

                this.currentUnitPercent.val(percent);
                this.currentUnitPx.val(px);
                this.currentUnitEm.val(em);

                editor.send(CHANGE_COLORSTEP, item);
                this.setBackgroundColor();
            }
        }
    }

    [EVENT(
        CHANGE_COLORSTEP,
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )] () { this.refresh(); }

    // 이미 선언된 메소드를 사용하여 메타 데이타로 쓴다. 
    [CLICK('$back')] (e) {
        this.addStep(e);
    }

    removeStep (e) {

        var id = e.$delegateTarget.attr('id')

        editor.remove(id);
        editor.send(CHANGE_LAYER, id);
    }

    addStep (e) {
        var {min, max} = this.getMinMax()
        var current = this.getCurrent(e)
        var percent = Math.floor((current - min) / (max - min) * 100)
        var item = editor.selection.image;
        if (!item) return; 

        image.insertColorStep(percent) 
        editor.send(CHANGE_LAYER, image);
    }

    getSortedStepList () {
        var list = this.refs.$stepList.$$('.drag-bar').map(it => {
            return {id : it.attr('id'), x: it.cssFloat('left')}
        })

        list.sort((a, b) => {
            if (a.x == b.x) return 0; 
            return a.x > b.x ? 1: -1;
        })

        return list.map(it => it.id)
    }

    selectStep (e) {
        var parent = e.$delegateTarget.parent();
        var item = editor.get( parent.attr('id'));
         
        item.select()
        editor.send(CHANGE_COLORSTEP, item); 

        this.currentStepBox = this.currentStepBox || parent;
        var $selected = this.refs.$stepList.$('.selected');
        if ($selected && !$selected.is(this.currentStepBox)) {
            $selected.removeClass('selected');
        }

        this.currentStepBox.addClass('selected')

        this.setBackgroundColor();
    }

    [CLICK('$steps .step') + SHIFT] (e) {
        this.removeStep(e);
    }

    [CLICK('$steps .step')] (e) {
        this.selectStep(e)
    }

    [CLICK('$steps .guide-change')] (e) {
        var id = e.$delegateTarget.attr('data-colorstep-id');

        var item = editor.get( id);

        if (item) {
            item.reset({cut : !item.cut})
            editor.send(CHANGE_COLORSTEP, item)
        }

    }

    [CHANGE('$steps .guide-unit select.unit')] (e) {

        var unit = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = editor.get( id)

        if (step) {
            step.changeUnit(unit, this.getMaxValue())
            editor.send(CHANGE_COLORSTEP, step);

            var $parent = e.$delegateTarget.parent();
            $parent.removeClass(UNIT_PERCENT, UNIT_PX, UNIT_EM).addClass(step.getUnit());
        }        
    }


    [INPUT('$steps input.percent')] (e) {
        var item = editor.selection.colorstep;
        if (!item) return; 

        var percent = +e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = editor.get( id)

        if (step) {

            step.percent = percent;
            step.changeUnit('percent', this.getMaxValue())

            this.currentStepBox.px('left', step.px)
            this.currentUnitPx.val(step.px);
            this.currentUnitEm.val(step.em);

            editor.send(CHANGE_COLORSTEP, step);
            this.setBackgroundColor();         
        }
    }

    [INPUT('$steps input.px')] (e) {
        var item = editor.selection.colorstep
        if (!item) return; 

        var px = +e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = editor.get( id)

        if (step) {
            
            step.px = px;
            step.changeUnit('px', this.getMaxValue()) 

            this.currentStepBox.px('left', step.px)                
            this.currentUnitPercent.val(step.percent);
            this.currentUnitEm.val(step.em);

            editor.send(CHANGE_COLORSTEP, step);
            this.setBackgroundColor();                    
        }
    }
    
    [INPUT('$steps input.em')] (e) {
        var item = editor.selection.colorstep;
        if (!item) return; 

        var em = +e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = editor.get( id)

        if (step) {
                      
            step.em = em;
            step.changeUnit('em', this.getMaxValue()) 
            
            this.currentStepBox.px('left', step.px)                
            this.currentUnitPercent.val(step.percent);
            this.currentUnitPx.val(step.px);

            editor.send(CHANGE_COLORSTEP, step);
            this.setBackgroundColor();         
        }
    }        

    // Event Bindings 
    end () { 
        if (this.refs.$stepList) {
            this.refs.$stepList.removeClass('mode-drag')       
        }
    }

    move () {
        this.refreshColorUI(true);
        this.refs.$stepList.addClass('mode-drag')
    }

    isStepElement (e) {
        return new Dom(e.target).hasClass('step');
    }

    [POINTERSTART('$steps .step') + IF('isStepElement') + MOVE() + END()] (e) {
        e.preventDefault();

        this.xy = e.xy;
        this.currentStep = e.$delegateTarget;
        this.currentStepBox = this.currentStep.parent();
        this.currentUnit = this.currentStepBox.$(".guide-unit")
        this.currentUnitPercent = this.currentUnit.$(".percent")
        this.currentUnitPx = this.currentUnit.$(".px")
        this.currentUnitEm = this.currentUnit.$(".em")

        if (this.currentStep) {
            this.selectStep(e)
        }

    }

}