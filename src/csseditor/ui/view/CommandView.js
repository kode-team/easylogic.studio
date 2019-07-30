import UIElement, { COMMAND } from "../../../util/UIElement";
import { editor } from "../../../editor/editor";
import { Layer } from "../../../editor/items/Layer";
import Color from "../../../util/Color";
import { Length } from "../../../editor/unit/Length";
import { TextLayer } from "../../../editor/items/layers/TextLayer";
import { ImageLayer } from "../../../editor/items/layers/ImageLayer";
import { CubeLayer } from "../../../editor/items/layers/CubeLayer";
import { SphereLayer } from "../../../editor/items/layers/SphereLayer";

export default class CommandView extends UIElement {

    refreshSelection () {
        this.emit('refreshAll')
        this.emit('refreshSelection');
        this.emit('hideSubEditor');
    }

    [COMMAND('add.layer')] (layer) {

        var artboard = editor.selection.currentArtboard
    
        if (artboard) {
          artboard.add(layer)
          editor.selection.select(layer);
    
          this.refreshSelection()
        }
    }

    [COMMAND('add.rect')] () {

        this.trigger('add.layer', new Layer({
            width: Length.px(100),
            height: Length.px(100),
            'background-color': Color.random()
        }))

    }


    [COMMAND('add.circle')] () {

        this.trigger('add.layer', new Layer({
            width: Length.px(100),
            height: Length.px(100),
            'background-color': Color.random(),
            'border-radius': 'border-radius: 100%'
        }))
    }



    [COMMAND('add.text')] () {
    
        this.trigger('add.layer', new TextLayer({
            content: 'Insert a text',
            width: Length.px(300),
            height: Length.px(50),
            'font-size': Length.px(30)
        }))
    }


    [COMMAND('add.image')] (src, info) {

        this.trigger('add.layer', new ImageLayer({
            ...info, src 
        }))

    }  


    [COMMAND('add.cube')] ( ) {

        this.trigger('add.layer', new CubeLayer({
            width: Length.px(100),
            height: Length.px(100),
            'background-color': Color.random()
        }))

    }

    [COMMAND('add.sphere')] ( ) {

        this.trigger('add.layer', new SphereLayer({
            width: Length.px(100),
            height: Length.px(100),
            'line-count': 10,
            'background-color': Color.random()
        }))

    }    

    [COMMAND('add.path')] () {
        this.emit('hideSubEditor');
        editor.selection.empty();
        this.emit('initSelectionTool');        
        this.emit('showPathEditor', 'move' );
    }


    [COMMAND('add.polygon')] (mode = 'move') {
        this.emit('hideSubEditor');    
        editor.selection.empty();
        this.emit('initSelectionTool');
        this.emit('showPolygonEditor', mode );    
    }    

    [COMMAND('add.star')] () {
        this.trigger('add.polygon', 'star')
    }   
    
    [COMMAND('switch.theme')] () {
        if (editor.theme === 'dark') {
            editor.theme = 'light'
        } else if (editor.theme === 'light') {
            editor.theme = 'dark'
        }

        this.emit('changeTheme')
    }
}