import UIElement, { EVENT } from '../../../../util/UIElement';
import { 
    CHANGE_EDITOR, 
    CHANGE_SELECTION,
    CHANGE_LAYER,
    CHANGE_TOOL
} from '../../../types/event';
import { CLICK, SELF } from '../../../../util/Event';
import { editor } from '../../../../editor/editor';

const DEFINED_ANGLES = {
    'to top': 0,
    'to top right': 45,    
    'to right': 90,
    'to bottom right': 135,    
    'to bottom': 180,
    'to bottom left': 225,    
    'to left': 270,
    'to top left' : 315

}

export default class PredefinedLayerAngle extends UIElement {

    template () { 
        return `
            <div class="predefined-angluar-group">
                <button type="button" data-value="to right"></button>                          
                <button type="button" data-value="to left"></button>                                                  
                <button type="button" data-value="to top"></button>                            
                <button type="button" data-value="to bottom"></button>                                        
                <button type="button" data-value="to top right"></button>                                
                <button type="button" data-value="to bottom right"></button>                                    
                <button type="button" data-value="to bottom left"></button>
                <button type="button" data-value="to top left"></button>
            </div>
        `
    }

    refresh () {
        this.$el.toggle(this.isShow())
    }


    isShow () {
        if (!editor.selection.layer) return false;

        return editor.config.get('guide.angle')
    }

    
    [CLICK('$el button') + SELF] (e) {
        var layer = editor.selection.layer; 
        if (layer) {
            layer.rotate = DEFINED_ANGLES[e.$delegateTarget.attr('data-value')];
            editor.send(CHANGE_LAYER, layer)
        }
    }

    [EVENT(
        CHANGE_LAYER,
        CHANGE_EDITOR,
        CHANGE_SELECTION,
        CHANGE_TOOL
    )] () { this.refresh() }

}