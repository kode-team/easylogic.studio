import UIElement, { COMMAND } from "../../../util/UIElement";
import { editor, EDIT_MODE_SELECTION } from "../../../editor/editor";
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

    [COMMAND('add.type')] (type) {

        editor.selection.empty()
        this.emit('refreshSelection')
        this.emit('hideSubEditor');
        editor.changeAddType(type)        

        this.emit('after.change.mode');
    }

    [COMMAND('new.layer')] (type, obj) {
        this.trigger(`add.${type}`, obj);
        editor.changeMode(EDIT_MODE_SELECTION);

        this.emit('after.change.mode');
    }

    [COMMAND('add.layer')] (layer, rect = {}) {

        var artboard = editor.selection.currentArtboard

        // 클릭 할 때 마지막 selection 의 current 를 유지를 해줘야할텐데 ... 
        // 무조건 artboard 기준으로 넣으면 될려나. 
    
        if (artboard) {
          artboard.add(layer)

          if (rect.x) { layer.setScreenX(rect.x.value); }
          if (rect.y) { layer.setScreenY(rect.y.value); }

          editor.selection.select(layer);
    
          this.refreshSelection()
        }
    }

    [COMMAND('add.rect')] (rect = {}) {

        this.trigger('add.layer', new Layer({
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'background-color': Color.random()
        }), rect)

    }


    [COMMAND('add.circle')] (rect = {}) {

        this.trigger('add.layer', new Layer({
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'background-color': Color.random(),
            'border-radius': 'border-radius: 100%'
        }), rect)
    }



    [COMMAND('add.text')] (rect = {}) {
    
        this.trigger('add.layer', new TextLayer({
            content: 'Insert a text',
            width: Length.px(300),
            height: Length.px(50),
            ...rect,
            'font-size': Length.px(30)
        }),rect)
    }


    [COMMAND('add.image')] (src, info) {

        this.trigger('add.layer', new ImageLayer({
            ...info, src 
        }))

    }  


    [COMMAND('add.cube')] (rect = {}) {

        this.trigger('add.layer', new CubeLayer({
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'background-color': Color.random()
        }), rect)

    }

    [COMMAND('add.sphere')] (rect = {} ) {

        this.trigger('add.layer', new SphereLayer({
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'line-count': 10,
            'background-color': Color.random()
        }), rect)

    }    

    [COMMAND('add.path')] () {
        this.emit('hideSubEditor');
        editor.selection.empty();
        this.emit('initSelectionTool');        
        this.emit('showPathEditor', 'draw' );
    }


    [COMMAND('add.polygon')] (mode = 'draw') {
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
            editor.changeTheme('light')
        } else if (editor.theme === 'light') {
            editor.changeTheme('dark')
        }

        this.emit('changeTheme')
    }

    [COMMAND('show.exportView')] () {
        this.emit('showExportView');
    }
}