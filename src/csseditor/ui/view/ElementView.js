import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND, LOAD } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { NEW_LINE, EMPTY_STRING } from "../../../util/css/types";
import { CHANGE_SELECTION } from "../../types/event";
import { editor } from "../../../editor/editor";

export default class ElementView extends UIElement {


    initState() {
        return {
            scale: 1, 
            left: Length.px(0),
            top: Length.px(0),
            width: Length.px(10000),
            height: Length.px(10000),
            html: ''
        }
    }


    template() {
        return `
            <div class='element-view' ref='$body'>
                <div ref='$view'></div>
            </div>
        `
    }

    [BIND('$body')] () {
        var artboard = editor.selection.currentArtboard || { width: Length.px(1000), height: Length.px(1000)}
        
        var width = Length.px(artboard.width.value + 400);
        var height = Length.px(artboard.height.value + 400);

        return {
            style: {
                'position': 'relative',
                width,
                height
            }
        }
    }

    createGridLine (width) {
        var subLineColor = 'rgba(247, 247, 247, 1)'
        var lineColor = 'rgba(232, 232, 232, 1)'
        var superLineColor = 'rgba(148, 148, 148, 0.5)'
        var subWidth = width/5;
        var superWidth = width * 5; 
        return `
            repeating-linear-gradient(to right, transparent 0px ${superWidth-1}px, ${superLineColor} ${superWidth-1}px ${superWidth}px ),
            repeating-linear-gradient(to bottom, transparent 0px ${superWidth-1}px, ${superLineColor} ${superWidth-1}px ${superWidth}px ),        
            repeating-linear-gradient(to right, transparent 0px ${width-1}px, ${lineColor} ${width-1}px ${width}px ),
            repeating-linear-gradient(to bottom, transparent 0px ${width-1}px, ${lineColor} ${width-1}px ${width}px ),
            repeating-linear-gradient(to right, transparent 0px ${subWidth - 1}px, ${subLineColor} ${subWidth - 1}px ${subWidth}px ),
            repeating-linear-gradient(to bottom, transparent 0px ${subWidth - 1}px, ${subLineColor} ${subWidth - 1}px ${subWidth}px )
        `
    }

    [BIND('$view')] () {
        var tempScale = 1;

        var artboard = editor.selection.currentArtboard || { width: Length.px(1000), height: Length.px(1000)}

        var width = Length.px(artboard.width.value  * tempScale)
        var height = Length.px(artboard.height.value  * tempScale)

        return {
            style: {
                "background-color": 'white',
                'background-image': this.createGridLine(100),
                'box-shadow': '0px 0px 5px 0px rgba(0, 0, 0, .5)',
                'position': 'absolute',
                'left': Length.percent(50),
                'top': Length.percent(50),
                transform: `translate(-50%, -50%) scale(${this.state.scale})`,
                width,
                height
            }
        }
    }    

    [LOAD('$view')] () {
        return this.state.html
    }

    [EVENT('addElement')] () {
        var artboard = editor.selection.currentArtboard
        var html = '' 
        if (artboard) {
            html = artboard.layers.map(it => {
                it.selected = editor.selection.current === it;
                return it.html
            }).join(NEW_LINE)
        }

        this.setState({ html })
    }

    selectCurrent (obj) {
        var $selectedElement = this.$el.$('.selected');

        if ($selectedElement) {
            if ($selectedElement.attr('data-id') != obj.id) {
                $selectedElement.removeClass('selected');
            }
        }

        if (obj.id) {
            var element = this.$el.$(`[data-id='${obj.id}']`)
            
            if (element) {
                element.addClass('selected');
            }
        }
    }

    [EVENT(CHANGE_SELECTION)] () {

        if (!this.state.html) {
            this.trigger('addElement');
        }

        var current = editor.selection.current || { id : EMPTY_STRING} 
        this.selectCurrent(current);
    }

    [EVENT('refreshScale')] (type) {

        if (type == 'plus') {
            this.setState({
                scale :  this.state.scale * 1.1
            }, false)

        } else {
            this.setState({
                scale :  this.state.scale * 0.9
            }, false)
        }

        this.refs.$view.css({
            transform: `translate(-50%, -50%) scale(${this.state.scale})`
        })
    }
    
} 