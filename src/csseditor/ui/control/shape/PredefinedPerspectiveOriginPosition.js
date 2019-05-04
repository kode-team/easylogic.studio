import UIElement, { EVENT } from '../../../../util/UIElement';
import { 
    CHANGE_EDITOR, 
    CHANGE_SELECTION, 
    CHANGE_ARTBOARD
} from '../../../types/event';
import { CLICK, SELF } from '../../../../util/Event';
import { editor } from '../../../../editor/editor';
import { Length, Position } from '../../../../editor/unit/Length';

const defined_position = {
    'to right': { 
        perspectiveOriginPositionX: Position.RIGHT, 
        perspectiveOriginPositionY: Position.CENTER
    },
    'to left': { 
        perspectiveOriginPositionX: Position.LEFT, 
        perspectiveOriginPositionY: Position.CENTER
    },
    'to top': { 
        perspectiveOriginPositionX: Position.CENTER, 
        perspectiveOriginPositionY: Position.TOP
    },
    'to bottom': { 
        perspectiveOriginPositionX: Position.CENTER, 
        perspectiveOriginPositionY: Position.BOTTOM
    },
    'to top right': { 
        perspectiveOriginPositionX: Position.RIGHT, 
        perspectiveOriginPositionY: Position.TOP
    },
    'to bottom right': { 
        perspectiveOriginPositionX: Position.RIGHT, 
        perspectiveOriginPositionY: Position.BOTTOM
    },
    'to bottom left': { 
        perspectiveOriginPositionX: Position.LEFT, 
        perspectiveOriginPositionY: Position.BOTTOM
    },
    'to top left': { 
        perspectiveOriginPositionX: Position.LEFT, 
        perspectiveOriginPositionY: Position.TOP
    }
}

export default class PredefinedPerspectiveOriginPosition extends UIElement {

    template () { 
        return `
            <div class="predefined-perspective-origin-position">
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
        var artboard = editor.selection.artboard;
        if (!artboard) return false; 

        return !!artboard.preserve
    }

    getPosition (type) {
        return defined_position[type] || {
            perspectiveOriginPositionX: Length.percent(0),
            perspectiveOriginPositionY: Length.percent(0)
        }
    }

    [CLICK('$el button') + SELF] (e) {
        var artboard = editor.selection.artboard;
        if (artboard) {
            artboard.reset(this.getPosition(e.$delegateTarget.attr('data-value')))
            editor.send(CHANGE_ARTBOARD, artboard);
        }
    }

    [EVENT(
        CHANGE_ARTBOARD,
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )] () { this.refresh() }

}