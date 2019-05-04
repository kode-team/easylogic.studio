import UIElement, { EVENT } from '../../../colorpicker/UIElement';

import { 
    CHANGE_EDITOR, 
    CHANGE_SELECTION
} from '../../types/event';
import { CLICK } from '../../../util/Event';
import { COLORSTEP_ORDERING_EQUALS, COLORSTEP_ORDERING_EQUALS_LEFT, COLORSTEP_ORDERING_EQUALS_RIGHT, COLORSTEP_CUT_OFF, COLORSTEP_CUT_ON } from '../../types/ColorStepTypes';
import { editor } from '../../../editor/editor';

export default class ImageToolbar extends UIElement {

    template () {  
        return `
            <div class='image-toolbar'>            
                <div class="step-align">
                    <label>Sorting</label>
                    <div class="button-group">
                        <button ref="$ordering" title="Full Ordering">=|=</button>
                        <button ref="$orderingLeft" title="Left Ordering">=|</button>
                        <button ref="$orderingRight" title="Right Ordering">|=</button>
                    </div>

                    <label>Cutting</label>
                    <div class="button-group">
                        <button class="cut" ref="$cutOff" title="Cut Off"></button>
                        <button class="cut on" ref="$cutOn" title="Cut On"></button>
                    </div>      
                </div>
                                
            </div>
        `
    }

    // indivisual layer effect 
    [EVENT(
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )]() { 
        this.refresh(); 
    }

    refresh() {
        this.$el.toggle(this.isShow())
    }

    isShow() {
        return editor.selection.backgroundImage;
    }


    [CLICK('$ordering')] (e) {
        this.dispatch(COLORSTEP_ORDERING_EQUALS)
    } 

    [CLICK('$orderingLeft')] (e) {
        this.dispatch(COLORSTEP_ORDERING_EQUALS_LEFT)
    }    

    [CLICK('$orderingRight')] (e) {
        this.dispatch(COLORSTEP_ORDERING_EQUALS_RIGHT)
    }        

    [CLICK('$cutOff')] (e) {
        this.dispatch(COLORSTEP_CUT_OFF)
    }

    [CLICK('$cutOn')] (e) {
        this.dispatch(COLORSTEP_CUT_ON)
    }    

}