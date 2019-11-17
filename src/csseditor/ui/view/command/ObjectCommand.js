import UIElement, { COMMAND } from "../../../../util/UIElement";
import { editor, EDIT_MODE_SELECTION } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";
import PathStringManager from "../../../../editor/parse/PathStringManager";
import PathParser from "../../../../editor/parse/PathParser";

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

    [COMMAND('add.component')] (type) {

        // editor.selection.empty()
        // this.emit('refreshSelection')
        this.emit('hideSubEditor');
        editor.changeAddType(type, true)

        this.emit('after.change.mode');
    }    

    [COMMAND('new.layer')] (type, obj) {
        this.trigger(`add.${type}`, obj);
        editor.changeMode(EDIT_MODE_SELECTION);

        this.emit('after.change.mode');
    }


    [COMMAND('new.component')] (type, obj) {
        this.trigger('add.layer', editor.createComponent(type, {
            ...obj,
        }), obj)

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
        } else {
            this.trigger('add.artboard')

            setTimeout(() => {
                this.trigger('add.layer', layer, rect);
            }, 50)
        }
    }

    [COMMAND('add.project')] (obj = {}) {
        var project = editor.add(editor.createComponent('project', {
            ...obj
        }))

        editor.selection.selectProject(project);

        this.refreshSelection()
    }

    [COMMAND('add.artboard')] (obj = {}) {
        var project = editor.selection.currentProject;
        if (!project) {
            project = editor.add(editor.createComponent('project'))
    
            editor.selection.selectProject(project);
        }

        var artboard = project.add(editor.createComponent('artboard', {
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

        this.trigger('add.layer', editor.createComponent('layer', {
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'background-color': Color.random()
        }), rect)

    }

    [COMMAND('add.svgrect')] (rect = {}) {

        this.trigger('add.layer', editor.createComponent('svg-path', {
            width: Length.px(100),
            height: Length.px(100),
            d: PathStringManager.makeRect(0, 0, rect.width.value, rect.height.value),
            ...rect
        }), rect)
    }        

    [COMMAND('add.svgtextpath')] (rect = {}) {

        this.trigger('add.layer', editor.createComponent('svg-textpath', {
            width: Length.px(100),
            height: Length.px(100),
            text: 'Insert a newText',
            'font-size': Length.parse(rect.height),
            textLength: '100%',
            d: PathStringManager.makeLine(0, rect.height.value, rect.width.value, rect.height.value),
            ...rect
        }), rect)
    }            


    [COMMAND('add.svgtext')] (rect = {}) {

        this.trigger('add.layer', editor.createComponent('svg-text', {
            width: Length.px(100),
            height: Length.px(100),
            text: 'Insert a newText',
            ...rect
        }), rect)
    }            

    [COMMAND('add.svgcircle')] (rect = {}) {
        this.trigger('add.layer', editor.createComponent('svg-path', {
            width: Length.px(100),
            height: Length.px(100),
            d: PathStringManager.makeCircle(0, 0, rect.width.value, rect.height.value),
            ...rect
        }), rect)
    }            


    [COMMAND('add.circle')] (rect = {}) {

        this.trigger('add.layer', editor.createComponent('layer', {
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'background-color': Color.random(),
            'border-radius': Length.percent(100)
        }), rect)
    }



    [COMMAND('add.text')] (rect = {}) {
    
        this.trigger('add.layer', editor.createComponent('text', {
            content: 'Insert a text',
            width: Length.px(300),
            height: Length.px(50),
            ...rect,
            'font-size': Length.px(30)
        }),rect)
    }


    [COMMAND('add.image')] (rect = {}) {
        this.trigger('add.layer', editor.createComponent('image', {
            ...rect 
        }), rect)

    }  

    [COMMAND('add.cube')] (rect = {}) {
        this.trigger('add.layer', editor.createComponent('cube', {
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'background-color': Color.random()
        }), rect)

    }


    [COMMAND('add.cylinder')] (rect = {}) {
        this.trigger('add.layer', editor.createComponent('cylinder', {
            width: Length.px(100),
            height: Length.px(100),
            ...rect,
            'background-color': Color.random()
        }), rect)

    }


    [COMMAND('convert.path')] (pathString, rect = null) {
        var current = editor.selection.current;

        // clip path 가 path 일 때 
        // path 속성을 가지고 있을 때 

        if (current )  {
            if (current.is('svg-path', 'svg-textpath')) {

                var d = pathString;

                if (rect) {
                    var parser = new PathParser(pathString)
                    parser.scale(current.width.value/rect.width, current.height.value/rect.height)

                    d = parser.d; 
                }

                // path string 을 저걸로 맞추기 
                current.updatePathItem({ d })

                // selection 을 다시 해야 cache 를 다시 설정한다. 
                // 이 구조를 바꿀려면 어떻게 해야할까?   
                editor.selection.select(current);

                this.emit('refreshSelectionStyleView');                        

            } else if (current['clip-path'].includes('path')) {
                var d = pathString;

                if (rect) {
                    var parser = new PathParser(pathString)
                    parser.scale(current.width.value/rect.width, current.height.value/rect.height)

                    d = parser.d; 
                }

                // path string 을 저걸로 맞추기 
                current.reset({
                    'clip-path': `path(${d})`
                })

                // selection 을 다시 해야 cache 를 다시 설정한다. 
                // 이 구조를 바꿀려면 어떻게 해야할까?   
                editor.selection.select(current);

                this.emit('refreshSelectionStyleView');  
            }
        }
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

    [COMMAND('resize.artboard')] (size = '') {
        var current = editor.selection.currentArtboard;
        if (current && current.is('artboard')) {
    
          if (!size.trim()) return;
    
          var [width, height] = size.split('x')
    
          width = Length.px(width);
          height = Length.px(height);
    
          current.reset({ width, height });
          editor.selection.select(current);
          this.refreshSelection();
        }
    }

}