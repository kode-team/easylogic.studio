import UIElement, { COMMAND } from "../../../../util/UIElement";
import { editor, EDIT_MODE_SELECTION } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
import { uuidShort } from "../../../../util/functions/math";
import AssetParser from "../../../../editor/parse/AssetParser";
import { saveResource, loadResource } from "../../../../editor/util/Resource";
import { isFunction } from "../../../../util/functions/func";
import ExportManager from "../../../../editor/ExportManager";
import Dom from "../../../../util/Dom";


const createItem = (obj) => {

    obj.layers = obj.layers.map(it => {
        return createItem(it);
    })

    var ComponentClass = editor.getComponentClass(obj.itemType)

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
        editor.setLocale(locale);
        this.emit('changed.locale')
    }

    [COMMAND('download.file')] (datauri, filename = 'easylogic.json') {

        var a = document.createElement('a');
        a.href = datauri; 
        a.download = filename 
        a.click();
        
        
    }

    [COMMAND('download.json')] (filename) {
        var json = JSON.stringify(editor.projects)
        var datauri = 'data:application/json;base64,' + window.btoa(json);

        this.trigger('download.file', datauri, filename || 'easylogic.json')
    }

    [COMMAND('download.to.svg')] () {
        var item = editor.selection.current || editor.selection.currentArtboard;

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
        var item = editor.selection.current || editor.selection.currentArtboard;

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
        saveResource('projects', editor.projects)
    }    

    [COMMAND('load.json')] (json) {

        json = json || loadResource('projects', []);

        var projects = json.map(p => createItem(p))

        projects.forEach(p => {
            p.artboards.forEach(artboard => {
                artboard.selectTimeline()
            })
        })

        if (projects.length) {
            var project = projects[0]
            editor.selection.selectProject(project)
            if (project.artboards.length) {
                var artboard = project.artboards[0]
                editor.selection.selectArtboard(artboard)

                if (artboard.layers.length) {
                    editor.selection.select(artboard.layers[0])
                } else {
                    editor.selection.select(artboard);
                }
            }
        }


        editor.load(projects);
        this.refreshSelection()
    }

    [COMMAND('copy')] () {
        editor.selection.copy();
    }

    [COMMAND('paste')] () {
        editor.selection.paste();
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

        editor.selection.move(dx * t, dy * t); 

        this.refreshSelection(true);

    }    

    getAddCommand (key) {
        switch(key) {
        case '1': return ['add.type', 'rect'];
        case '2': return ['add.type', 'circle'];
        case '3': return ['add.type', 'text'];
        case '4': return ['add.type', 'image'];
        case '5': return ['add.type', 'cube'];
        case '6': return ['add.type', 'svgrect'];
        case '7': return ['add.path'];
        case '8': return ['add.polygon'];
        case '9': return ['add.star'];
        }
    }

    /* tools */ 
    
    [COMMAND('switch.theme')] () {
        if (editor.theme === 'dark') {
            editor.changeTheme('light')
        } else {
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

    [COMMAND('drop.image.url')] (imageUrl) {
            // convert data or blob to local url 
        this.trigger('load.original.image', {local: imageUrl}, (info) => {

            this.emit('add.image', {src: info.local, ...info });
            editor.changeMode(EDIT_MODE_SELECTION);
            this.emit('after.change.mode');                
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
        var project = editor.selection.currentProject;

        if (project) {

            // append image asset 
            project.createImage(obj);
            this.emit('addImageAsset');

            // convert data or blob to local url 
            this.trigger('load.original.image', obj, (info) => {
                this.emit('add.image', {src: obj.local, ...info, ...rect });
                editor.changeMode(EDIT_MODE_SELECTION);
                this.emit('after.change.mode');                
            });

        }
    }

    [COMMAND('add.assets.svgfilter')] (callback) {

        var project = editor.selection.currentProject;

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

            var project = editor.selection.currentProject;

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