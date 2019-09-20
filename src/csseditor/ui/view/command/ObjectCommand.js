import UIElement, { COMMAND } from "../../../../util/UIElement";
import { editor, EDIT_MODE_SELECTION } from "../../../../editor/editor";
import { Project } from "../../../../editor/items/Project";
import { ArtBoard } from "../../../../editor/items/ArtBoard";
import { Length } from "../../../../editor/unit/Length";
import { Layer } from "../../../../editor/items/Layer";
import Color from "../../../../util/Color";
import { SphereLayer } from "../../../../editor/items/layers/SphereLayer";
import { CubeLayer } from "../../../../editor/items/layers/CubeLayer";
import { ImageLayer } from "../../../../editor/items/layers/ImageLayer";
import { TextLayer } from "../../../../editor/items/layers/TextLayer";

export default class ObjectCommand extends UIElement {

    refreshSelection () {
        this.emit('refreshAll')
        this.emit('hideSubEditor');
        this.emit('refreshSelection');        
        this.emit('refreshSelectionTool')      
        this.emit('noneSelectMenu') 
    }

    [COMMAND('add.type')] (type) {

        // editor.selection.empty()
        // this.emit('refreshSelection')
        this.emit('hideSubEditor');
        editor.changeAddType(type)        

        this.emit('after.change.mode');
    }

    [COMMAND('new.layer')] (type, obj) {
        this.trigger(`add.${type}`, obj);
        editor.changeMode(EDIT_MODE_SELECTION);

        this.emit('after.change.mode');
    }

    [COMMAND('select.item')] () {
        editor.changeMode(EDIT_MODE_SELECTION);
        this.emit('after.change.mode');
    }

    [COMMAND('add.layer')] (layer, rect = {}) {

        var containerItem = editor.selection.current || editor.selection.currentArtboard
    
        if (containerItem) {

            if (!containerItem.enableHasChildren()) {
                containerItem = containerItem.parent;
            }

            containerItem.add(layer)

            if (rect.x) { layer.setScreenX(rect.x.value); }
            if (rect.y) { layer.setScreenY(rect.y.value); }

            editor.selection.select(layer);
    
            this.refreshSelection()
        }
    }

    [COMMAND('add.project')] (obj = {}) {
        var project = editor.add(new Project({
            ...obj
        }))

        editor.selection.selectProject(project);

        this.refreshSelection()
    }

    [COMMAND('add.artboard')] (obj = {}) {
        var project = editor.selection.currentProject;
        if (!project) {
            project = editor.add(new Project())
    
            editor.selection.selectProject(project);
        }

        var artboard = project.add(new ArtBoard({
            x: Length.px(300),
            y: Length.px(300),
            width: Length.px(300),
            height: Length.px(600),
            ...obj
          }))

          editor.selection.selectArtboard(artboard);
          editor.selection.select(artboard);
    
          this.refreshSelection()
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
            'border-radius': Length.percent(100)
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


    [COMMAND('add.image')] (rect = {}) {
        this.trigger('add.layer', new ImageLayer({
            ...rect 
        }), rect)

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

    [COMMAND('open.polygon.editor')] (points = '', changeEvent = 'updatePolygonItem') {
        var current = editor.selection.current;
        if (current) {
            this.emit('showPolygonEditor', 'draw', {
                changeEvent,
                current,
                points,
                screenX: current.screenX,
                screenY: current.screenY,
                screenWidth: current.screenWidth,
                screenHeight: current.screenHeight,
            }) 
        }
    }

    [COMMAND('open.path.editor')] (d = '', changeEvent = 'updatePathItem') {
        var current = editor.selection.current;
        if (current) {
            this.emit('showPathEditor', 'draw', {
                changeEvent,
                current,
                d,
                screenX: current.screenX,
                screenY: current.screenY,
                screenWidth: current.screenWidth,
                screenHeight: current.screenHeight,
            }) 
        }
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

    [COMMAND('select.by.id')] (id) {
        editor.selection.selectById(id);
    
        this.refreshSelection()
    }

}