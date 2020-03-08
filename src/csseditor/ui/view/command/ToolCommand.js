import UIElement, { COMMAND } from "../../../../util/UIElement";
import { EDIT_MODE_SELECTION } from "../../../../editor/Editor";
import { Length } from "../../../../editor/unit/Length";
import { uuidShort } from "../../../../util/functions/math";
import AssetParser from "../../../../editor/parse/AssetParser";
import { isFunction } from "../../../../util/functions/func";
import ExportManager from "../../../../editor/ExportManager";
import Dom from "../../../../util/Dom";
import { ComponentManager } from "../../../../editor/ComponentManager";


const createItem = (obj) => {

    obj.layers = obj.layers.map(it => {
        return createItem(it);
    })

    var ComponentClass = ComponentManager.getComponentClass(obj.itemType)

    if (!ComponentClass) {
        throw new Error(`${obj.itemType} type is not valid.`)
    }

    return new ComponentClass(obj);
}

export default class ToolCommand extends UIElement {
    refreshSelection (isSelectedItems = false) {
        if (isSelectedItems) {
            this.emit('refreshSelectionStyleView')
        } else {
            this.emit('refreshAll')
        }

        this.emit('hideSubEditor');

        this.emit('refreshAllElementBoundSize');        
        this.emit('refreshSelection');        
        this.emit('refreshSelectionTool')       
    }

    [COMMAND('set.locale')] (locale) {
        this.$editor.setLocale(locale);
        this.emit('changed.locale')
    }

    [COMMAND('download.file')] (datauri, filename = 'easylogic.json') {

        var a = document.createElement('a');
        a.href = datauri; 
        a.download = filename 
        a.click();
        
        
    }

    [COMMAND('download.json')] (filename) {
        var json = JSON.stringify(this.$editor.projects)
        var datauri = 'data:application/json;base64,' + window.btoa(json);

        this.trigger('download.file', datauri, filename || 'easylogic.json')
    }

    [COMMAND('download.to.svg')] () {
        var item = this.$selection.current || this.$selection.currentArtboard;

        var svgString = ExportManager.generateSVG(item).trim();
        var datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
        var filename = item.id;

        this.trigger('download.file', datauri, filename)
    }

    [COMMAND('create.image.png')] (img, callback, imageType = 'image/png') {
        var canvas = Dom.create('canvas');
        var {width, height} = img; 
        canvas.resize({ width, height });
        canvas.drawImage(img)

        callback && callback (canvas.toDataURL(imageType))
    }

    [COMMAND('download.to.png')] () {
        var item = this.$selection.current || this.$selection.currentArtboard;

        var svgString = ExportManager.generateSVG(item).trim();
        var datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
        var filename = item.id;

        this.trigger('load.original.image', {local: datauri}, (info, img) => {
            this.trigger('create.image.png', img, (pngDataUri) => {
                this.trigger('download.file', pngDataUri, filename)
            }, 'image/png')
        })
    }

    [COMMAND('save.json')] () {
        this.$editor.saveResource('projects', this.$editor.projects)
    }    

    [COMMAND('load.json')] (json) {

        json = json || this.$editor.loadResource('projects', []);

        var projects = json.map(p => createItem(p))

        projects.forEach(p => {
            p.artboards.forEach(artboard => {
                artboard.selectTimeline()
            })
        })

        if (projects.length) {
            var project = projects[0]
            this.$selection.selectProject(project)
            if (project.artboards.length) {
                var artboard = project.artboards[0]
                this.$selection.selectArtboard(artboard)

                if (artboard.layers.length) {
                    this.$selection.select(artboard.layers[0])
                } else {
                    this.$selection.select(artboard);
                }
            }
        }


        this.$editor.load(projects);
        this.refreshSelection()
    }

    [COMMAND('copy')] () {
        this.$selection.copy();
    }

    [COMMAND('paste')] () {
        this.$selection.paste();
        this.emit('refreshAll');
    }

    [COMMAND('keyup.canvas.view')] (key) {
        var command = this.getAddCommand(key);

        this.emit(...command);
    }

    [COMMAND('arrow.keydown.canvas.view')] (key, isAlt = false, isShift = false) {
        var dx = 0;
        var dy = 0; 
        var t = 1; 

        if (isAlt) {
            t = 5;
        } else if (isShift) {
            t = 10; 
        }

        switch(key) {
        case 'ArrowDown': dy = 1; break; 
        case 'ArrowUp': dy = -1; break; 
        case 'ArrowLeft': dx = -1; break; 
        case 'ArrowRight': dx = 1; break; 
        }

        this.$selection.move(dx * t, dy * t); 

        this.refreshSelection(true);

    }    

    getAddCommand (key) {
        switch(key) {
        case '1': return ['addComponentType', 'rect'];
        case '2': return ['addComponentType', 'circle'];
        case '3': return ['addComponentType', 'text'];
        case '4': return ['addComponentType', 'image'];
        case '5': return ['addComponentType', 'cube'];
        case '6': return ['addComponentType', 'svgrect'];
        case '7': return ['addPath'];
        case '8': return ['addPolygon'];
        case '9': return ['addStar'];
        }
    }

    /* tools */ 
    
    [COMMAND('switch.theme')] ( theme ) {
        this.$editor.changeTheme(theme);

        this.emit('changeTheme')
    }

    [COMMAND('show.exportView')] () {
        this.emit('showExportWindow');
    }

    [COMMAND('update.scale')] (scale) {
        this.$editor.scale = scale;     
        this.emit('changeScale')
    }

    /* files */ 
    [COMMAND('drop.items')] (items = []) {
        this.trigger('update.resource', items);
    }

    [COMMAND('drop.image.url')] (imageUrl) {
            // convert data or blob to local url 
        this.trigger('load.original.image', {local: imageUrl}, (info) => {

            this.emit('addImage', {src: info.local, ...info });
            this.$editor.changeMode(EDIT_MODE_SELECTION);
            this.emit('afterChangeMode');                
        });
    }

    [COMMAND('load.original.image')] (obj, callback) {

        var img = new Image();
        img.onload = () => {

            var info = {
                local: obj.local,
                naturalWidth: Length.px(img.naturalWidth),
                naturalHeight: Length.px(img.naturalHeight), 
                width: Length.px(img.naturalWidth),
                height: Length.px(img.naturalHeight)
            }

            callback && callback(info, img);
        }
        img.src = obj.local; 
    }

    [COMMAND('add.assets.image')] (obj, rect = {}) {
        var project = this.$selection.currentProject;

        if (project) {

            // append image asset 
            project.createImage(obj);
            this.emit('addImageAsset');

            // convert data or blob to local url 
            this.trigger('load.original.image', obj, (info) => {
                this.emit('addImage', {src: obj.local, ...info, ...rect });
                this.$editor.changeMode(EDIT_MODE_SELECTION);
                this.emit('afterChangeMode');                
            });

        }
    }

    [COMMAND('add.assets.svgfilter')] (callback) {

        var project = this.$selection.currentProject;

        if (project) {
            var id = uuidShort()
            var index = project.createSVGFilter({ id, filters: []})
    
            callback && callback (index, id);
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
                    id: uuidShort(),
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
                    id: uuidShort(),
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
                id: uuidShort(),
                type: item.type,
                name: item.name, 
                original: datauri, 
                local
            }, rect)
        }

        reader.readAsDataURL(item);
    }

    [COMMAND('remove.asset.image')] (localUrl) {
        URL.revokeObjectURL(localUrl);
    }

    [COMMAND('update.asset.image')] (item, callback) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var datauri = e.target.result;
            var local = URL.createObjectURL(item);

            var project = this.$selection.currentProject;

            if (project) {
    
                // append image asset 
                project.createImage({
                    id: uuidShort(),
                    type: item.type,
                    name: item.name, 
                    original: datauri, 
                    local
                });
                this.emit('addImageAsset');
                isFunction(callback) && callback (local);
            }
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
                    this.trigger('addText', {
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