import UIElement, { EVENT } from '../../../../util/UIElement';
import { 
    CHANGE_EDITOR, 
    CHANGE_SELECTION, 
    CHANGE_IMAGE
} from '../../../types/event';
import { CLICK, SELF } from '../../../../util/Event';
import { Position } from '../../../../editor/unit/Length';
import { editor } from '../../../../editor/editor';

const defined_position = {
    'to right': { 
        x: Position.RIGHT, 
        y: Position.CENTER
    },
    'to left': { 
        x: Position.LEFT, 
        y: Position.CENTER
    },
    'to top': { 
        x: Position.CENTER, 
        y: Position.TOP
    },
    'to bottom': { 
        x: Position.CENTER, 
        y: Position.BOTTOM
    },
    'to top right': { 
        x: Position.RIGHT, 
        y: Position.TOP
    },
    'to bottom right': { 
        x: Position.RIGHT, 
        y: Position.BOTTOM
    },
    'to bottom left': { 
        x: Position.LEFT, 
        y: Position.BOTTOM
    },
    'to top left': { 
        x: Position.LEFT, 
        y: Position.TOP
    }
}

export default class PredefinedBackgroundPosition extends UIElement {

    template () { 
        return `
            <div class="predefined-background-position">
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
        return editor.selection.backgroundImage
    }

    getPosition (type) {
        return defined_position[type] || {
            x: Position.CENTER,
            y: Position.CENTER
        }
    }

    [CLICK('$el button') + SELF] (e) {
        var image = editor.selection.backgroundImage;
        if (image) {
            image.reset(this.getPosition(e.$delegateTarget.attr('data-value')))
            editor.send(CHANGE_IMAGE, image)
        }
    }

    [EVENT(
        CHANGE_IMAGE,
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )] () { this.refresh() }

}