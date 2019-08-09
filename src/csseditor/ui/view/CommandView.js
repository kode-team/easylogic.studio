import UIElement, { COMMAND, EVENT } from "../../../util/UIElement";
import { editor, EDIT_MODE_SELECTION } from "../../../editor/editor";
import { Layer } from "../../../editor/items/Layer";
import Color from "../../../util/Color";
import { Length } from "../../../editor/unit/Length";
import { TextLayer } from "../../../editor/items/layers/TextLayer";
import { ImageLayer } from "../../../editor/items/layers/ImageLayer";
import { CubeLayer } from "../../../editor/items/layers/CubeLayer";
import { SphereLayer } from "../../../editor/items/layers/SphereLayer";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { Project } from "../../../editor/items/Project";
import AssetParser from "../../../editor/parse/AssetParser";
import Dom from "../../../util/Dom";

export default class CommandView extends UIElement {

    [COMMAND('copy')] () {
        editor.selection.copy();
    }

    [COMMAND('paste')] () {
        editor.selection.paste();
        this.emit('refreshAll');
    }

    [COMMAND('keyup.canvas.view')] (key) {
        var command = this.getAddCommand(key);

        this.trigger(...command);
    }

    getAddCommand (key) {
        switch(key) {
        case '1': return ['add.type', 'rect'];
        case '2': return ['add.type', 'circle'];
        case '3': return ['add.type', 'text'];
        case '4': return ['add.type', 'image'];
        case '5': return ['add.type', 'cube'];
        case '6': return ['add.path'];
        case '7': return ['add.polygon'];
        case '8': return ['add.star'];
        }
    }

    refreshSelection () {
        this.emit('refreshAll')
        this.emit('hideSubEditor');
        this.emit('refreshSelection');        
        this.emit('refreshSelectionTool')       
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


    [COMMAND('add.polygon')] (mode = 'draw') {
        this.emit('hideSubEditor');    
        editor.selection.empty();
        this.emit('initSelectionTool');
        this.emit('showPolygonEditor', mode );    
    }    

    [COMMAND('add.star')] () {
        this.trigger('add.polygon', 'star')
    }   


    /* tools */ 
    
    [COMMAND('switch.theme')] () {
        if (editor.theme === 'dark') {
            editor.changeTheme('light')
        } else if (editor.theme === 'light') {
            editor.changeTheme('red')
        } else if (editor.theme === 'red') {
            editor.changeTheme('orange')      
        } else if (editor.theme === 'orange') {
            editor.changeTheme('dark')                        
        }

        this.emit('changeTheme')
    }

    [COMMAND('show.exportView')] () {
        this.emit('showExportWindow');
    }

    [COMMAND('update.scale')] (scale) {
        editor.scale = scale;     
        this.emit('changeScale')
    }

    /* files */ 
    [COMMAND('drop.items')] (items = []) {
        this.trigger('update.resource', items);
    }

    [COMMAND('load.original.image')] (obj, callback) {

        var img = new Image();
        img.onload = () => {

            var info = {
                naturalWidth: Length.px(img.naturalWidth),
                naturalHeight: Length.px(img.naturalHeight), 
                width: Length.px(img.naturalWidth),
                height: Length.px(img.naturalHeight)
            }

            callback && callback(info);
        }
        img.src = obj.local; 
    }

    [COMMAND('add.assets.image')] (obj, rect = {}) {
        var project = editor.selection.currentProject;

        if (project) {

            // append image asset 
            project.createImage(obj);
            this.emit('addImageAsset');

            // convert data or blob to local url 
            this.trigger('load.original.image', obj, (info) => {
                this.trigger('add.image', {src: obj.local, ...info, ...rect });
                editor.changeMode(EDIT_MODE_SELECTION);
                this.emit('after.change.mode');                
            });

        }
    }

    [COMMAND('update.uri-list')] (item) {

        var datauri = item.data; 
        if (datauri.indexOf('data:') > -1) {
            var info = AssetParser.parse(datauri, true);

            // datauri 그대로 정의 될 때 
            switch(info.mimeType) {
            case 'image/png':  
            case 'image/gif': 
            case 'image/jpg': 
            case 'image/jpeg': 
                this.trigger('add.assets.image', {
                    type: info.mimeType,
                    name: '',
                    original: datauri, 
                    local: info.local
                });            
                break; 
            }
        } else {

            // url 로 정의 될 때 
            var ext = item.data.split('.').pop();
            var name = item.data.split('/').pop();

            switch(ext) {
            case 'png':
            case 'jpg':
            case 'gif':
            case 'svg':

                this.trigger('add.assets.image', {
                    type: 'image/' + ext,
                    name,
                    original: item.data, 
                    local: item.data
                })
                break; 
            }
        }

    }

    [COMMAND('update.image')] (item, rect) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var datauri = e.target.result;
            var local = URL.createObjectURL(item);

            this.trigger('add.assets.image', {
                type: item.type,
                name: item.name, 
                original: datauri, 
                local
            }, rect)
        }

        reader.readAsDataURL(item);
    }

    [COMMAND('update.resource')] (items) {
        items.forEach(item => {
            switch(item.type) {
            case 'image/svg+xml': 
            case 'image/png':  
            case 'image/gif': 
            case 'image/jpg': 
            case 'image/jpeg': 
                this.trigger('update.image', item); 
                break; 
            case 'text/plain':
            case 'text/html':
                if (items.length) {
                    this.trigger('add.text', {
                         content: item.data
                    });
                }
                // this.trigger('update.string', item);
                break;
            case 'text/uri-list':
                this.trigger('update.uri-list', item);
                break;
            }
        })
    }
}