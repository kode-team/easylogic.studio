import UIElement, { EVENT } from '../../../../util/UIElement';
import { CHANGE_IMAGE, CHANGE_EDITOR, CHANGE_SELECTION } from '../../../types/event';
import { CLICK, CHANGE } from '../../../../util/Event';
import { editor } from '../../../../editor/editor';


export default class PredefinedRadialGradientAngle extends UIElement {

    template () { 
        return `
            <div class="predefined-radial-gradient-angle">
                <button ref="$center" type="button" data-value="center" title="center"><span class='circle'></span></button>            
                <select class="radial-type-list" ref="$select">
                    <option value="ellipse">ellipse</option>                
                    <option value="closest-side">closest-side</option> 
                    <option value="closest-corner">closest-corner</option>
                    <option value="farthest-side">farthest-side</option>
                    <option value="farthest-corner">farthest-corner</option>                    
                    <option value="circle">circle</option>
                    <option value="circle closest-side">circle closest-side</option> 
                    <option value="circle closest-corner">circle closest-corner</option>
                    <option value="circle farthest-side">circle farthest-side</option>
                    <option value="circle farthest-corner">circle farthest-corner</option>                                        
                </select>
            </div>
        `
    }

    refresh () {
        var image = editor.selection.backgroundImage; 
        if (image) {
            this.refs.$select.val(image.image.radialType);
        }
    }

    [EVENT(
        CHANGE_IMAGE,
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )] () { this.refresh() }    

    [CHANGE('$select')] (e) {
        var image = editor.selection.backgroundImage; 
        if (image) {
            image.image.radialType = this.refs.$select.val();
            editor.send(CHANGE_IMAGE, image)
        };

    }

    [CLICK('$center')] (e) {
        var image = editor.selection.backgroundImage; 
        if (image) {
            image.image.radialPosition = Position.CENTER
            editor.send(CHANGE_IMAGE, image)
        }
    }
}