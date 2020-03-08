import UIElement, { COMMAND } from "../../../../util/UIElement";
import { EDIT_MODE_SELECTION, Editor } from "../../../../editor/Editor";
import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";
import PathStringManager from "../../../../editor/parse/PathStringManager";
import PathParser from "../../../../editor/parse/PathParser";
import { isFunction } from "../../../../util/functions/func";

export default class ObjectCommand extends UIElement {
    refreshSelection () {

        this.emit('hideSubEditor');
        this.emit('noneSelectMenu')
        this.emit('refreshAll')    

        this.emit('refreshAllElementBoundSize');
        this.emit('refreshSelection');
        this.emit('refreshSelectionTool');    
    }

    // [COMMAND('addComponentType')] (type) {

    //     // this.$selection.empty()
    //     // this.emit('refreshSelection')
    //     this.emit('hideSubEditor');
    //     this.$editor.changeAddType(type)

    //     this.emit('afterChangeMode');
    // }

    // [COMMAND('add.component')] (type) {

    //     // this.$selection.empty()
    //     // this.emit('refreshSelection')
    //     this.emit('hideSubEditor');
    //     this.$editor.changeAddType(type, true)

    //     this.emit('afterChangeMode');
    // }    

    // [COMMAND('new.layer')] (type, obj) {
    //     this.trigger(`add.${type}`, obj);
    //     this.$editor.changeMode(EDIT_MODE_SELECTION);

    //     this.emit('afterChangeMode');
    // }


    // [COMMAND('newComponent')] (type, obj) {
    //     this.emit('addLayer', this.$editor.createComponent(type, {
    //         'background-color': Color.random(),
    //         ...obj,
    //     }), obj)

    //     this.$editor.changeMode(EDIT_MODE_SELECTION);

    //     this.emit('afterChangeMode');
    // }    

    // [COMMAND('selectItem')] () {
    //     this.$editor.changeMode(EDIT_MODE_SELECTION);
    //     this.emit('afterChangeMode');
    // }

    // [COMMAND('addLayer')] (layer, rect = {}) {

    //     var containerItem = this.$selection.current || this.$selection.currentArtboard
    
    //     if (containerItem) {

    //         if (!containerItem.enableHasChildren()) {
    //             containerItem = containerItem.parent;
    //         }

    //         containerItem.add(layer)

    //         if (rect.x) { layer.setScreenX(rect.x.value); }
    //         if (rect.y) { layer.setScreenY(rect.y.value); }

    //         this.$selection.select(layer);
    
    //         this.refreshSelection()
    //     } else {
    //         this.trigger('addArtBoard')

    //         setTimeout(() => {
    //             this.trigger('addLayer', layer, rect);
    //         }, 50)
    //     }
    // }

    // [COMMAND('addProject')] (obj = {}) {
    //     var project = this.$editor.add(this.$editor.createComponent('project', {
    //         ...obj
    //     }))

    //     this.$selection.selectProject(project);

    //     this.refreshSelection()
    // }

    // [COMMAND('addArtBoard')] (obj = {}) {
    //     var project = this.$selection.currentProject;
    //     if (!project) {
    //         project = this.$editor.add(this.$editor.createComponent('project'))
    
    //         this.$selection.selectProject(project);
    //     }

    //     var artboard = project.add(this.$editor.createComponent('artboard', {
    //         x: Length.px(300),
    //         y: Length.px(300),
    //         width: Length.px(300),
    //         height: Length.px(600),
    //         ...obj
    //       }))

    //       this.$selection.selectArtboard(artboard);
    //       this.$selection.select(artboard);
    
    //       this.refreshSelection()
    // }

    // [COMMAND('add.rect')] (rect = {}) {

    //     this.trigger('addLayer', this.$editor.createComponent('layer', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         ...rect,
    //         'background-color': Color.random()
    //     }), rect)

    // }

    // [COMMAND('add.svgrect')] (rect = {}) {

    //     this.trigger('addLayer', this.$editor.createComponent('svg-path', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         d: PathStringManager.makeRect(0, 0, rect.width.value, rect.height.value),
    //         ...rect
    //     }), rect)
    // }        

    // [COMMAND('add.svgtextpath')] (rect = {}) {

    //     this.trigger('addLayer', this.$editor.createComponent('svg-textpath', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         text: 'Insert a newText',
    //         'font-size': Length.parse(rect.height),
    //         textLength: '100%',
    //         d: PathStringManager.makeLine(0, rect.height.value, rect.width.value, rect.height.value),
    //         ...rect
    //     }), rect)
    // }            


    // [COMMAND('add.svgtext')] (rect = {}) {

    //     this.trigger('addLayer', this.$editor.createComponent('svg-text', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         text: 'Insert a newText',
    //         ...rect
    //     }), rect)
    // }            

    // [COMMAND('add.svgcircle')] (rect = {}) {
    //     this.trigger('addLayer', this.$editor.createComponent('svg-path', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         d: PathStringManager.makeCircle(0, 0, rect.width.value, rect.height.value),
    //         ...rect
    //     }), rect)
    // }            


    // [COMMAND('add.circle')] (rect = {}) {

    //     this.trigger('addLayer', this.$editor.createComponent('layer', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         ...rect,
    //         'background-color': Color.random(),
    //         'border-radius': Length.percent(100)
    //     }), rect)
    // }



    // [COMMAND('addText')] (rect = {}) {
    
    //     this.trigger('addLayer', this.$editor.createComponent('text', {
    //         content: 'Insert a text',
    //         width: Length.px(300),
    //         height: Length.px(50),
    //         ...rect,
    //         'font-size': Length.px(30)
    //     }),rect)
    // }


    // [COMMAND('addImage')] (rect = {}) {
    //     this.trigger('addLayer', this.$editor.createComponent('image', {
    //         ...rect 
    //     }), rect)

    // }  

    // [COMMAND('add.cube')] (rect = {}) {
    //     this.trigger('addLayer', this.$editor.createComponent('cube', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         ...rect,
    //         'background-color': Color.random()
    //     }), rect)

    // }


    // [COMMAND('add.cylinder')] (rect = {}) {
    //     this.trigger('addLayer', this.$editor.createComponent('cylinder', {
    //         width: Length.px(100),
    //         height: Length.px(100),
    //         ...rect,
    //         'background-color': Color.random()
    //     }), rect)

    // }


    // [COMMAND('convertPath')] (pathString, rect = null) {
    //     var current = this.$selection.current;

    //     // clip path 가 path 일 때 
    //     // path 속성을 가지고 있을 때 

    //     if (current )  {
    //         if (current.is('svg-path', 'svg-textpath')) {

    //             var d = pathString;

    //             if (rect) {
    //                 var parser = new PathParser(pathString)
    //                 parser.scale(current.width.value/rect.width, current.height.value/rect.height)

    //                 d = parser.d; 
    //             }

    //             // path string 을 저걸로 맞추기 
    //             current.updatePathItem({ d })

    //             // selection 을 다시 해야 cache 를 다시 설정한다. 
    //             // 이 구조를 바꿀려면 어떻게 해야할까?   
    //             this.$selection.select(current);

    //             this.emit('refreshSelectionStyleView');                        

    //         } else if (current['clip-path'].includes('path')) {
    //             var d = pathString;

    //             if (rect) {
    //                 var parser = new PathParser(pathString)
    //                 parser.scale(current.width.value/rect.width, current.height.value/rect.height)

    //                 d = parser.d; 
    //             }

    //             // path string 을 저걸로 맞추기 
    //             current.reset({
    //                 'clip-path': `path(${d})`
    //             })

    //             // selection 을 다시 해야 cache 를 다시 설정한다. 
    //             // 이 구조를 바꿀려면 어떻게 해야할까?   
    //             this.$selection.select(current);

    //             this.emit('refreshSelectionStyleView');  
    //         }
    //     }
    // }

    // [COMMAND('addPath')] () {
    //     this.emit('hideSubEditor');
    //     this.$selection.empty();
    //     this.emit('initSelectionTool');        
    //     this.emit('showPathEditor', 'draw' );
    // } 

    // [COMMAND('open.polygon.editor')] (points = '', changeEvent = 'updatePolygonItem') {
    //     var current = this.$selection.current;
    //     if (current) {
    //         this.emit('showPolygonEditor', 'draw', {
    //             changeEvent,
    //             current,
    //             points,
    //             screenX: current.screenX,
    //             screenY: current.screenY,
    //             screenWidth: current.screenWidth,
    //             screenHeight: current.screenHeight,
    //         }) 
    //     }
    // }

    // [COMMAND('open.path.editor')] (d = '', changeEvent = 'updatePathItem') {
    //     var current = this.$selection.current;
    //     if (current) {
    //         this.emit('showPathEditor', 'draw', {
    //             changeEvent,
    //             current,
    //             d,
    //             screenX: current.screenX,
    //             screenY: current.screenY,
    //             screenWidth: current.screenWidth,
    //             screenHeight: current.screenHeight,
    //         }) 
    //     }
    // }


    // [COMMAND('addPolygon')] (mode = 'draw') {
    //     this.emit('hideSubEditor');    
    //     this.$selection.empty();
    //     this.emit('initSelectionTool');
    //     this.emit('showPolygonEditor', mode );    
    // }    

    // [COMMAND('addStar')] () {
    //     this.trigger('addPolygon', 'star')
    // }   

    // [COMMAND('select.by.id')] (id) {
    //     this.$selection.selectById(id);
    
    //     this.refreshSelection()
    // }

    // [COMMAND('resizeArtBoard')] (size = '') {
    //     var current = this.$selection.currentArtboard;
    //     if (current && current.is('artboard')) {
    
    //       if (!size.trim()) return;
    
    //       var [width, height] = size.split('x')
    
    //       width = Length.px(width);
    //       height = Length.px(height);
    
    //       current.reset({ width, height });
    //       this.$selection.select(current);
    //       this.refreshSelection();
    //     }
    // }

    // [COMMAND('refreshElement')] (current, isChangeFragment = false) {
    //     // 화면 사이즈 조정         
    //     this.emit('refreshSelectionStyleView', current, isChangeFragment, current && current.enableHasChildren() === false)

    //     // 화면 레이아웃 재정렬 
    //     this.emit('refreshElementBoundSize', this.$selection.getRootItem(current))
    // }
    

    // /**
    //  * 속성 변화 command 실행 
    //  * 
    //  * @param {Object} attrs 적용될 속성 객체 
    //  * @param {Array<string>} ids 아이디 리스트 
    //  * @param {Boolean} isChangeFragment 중간 색상 변화 여부 
    //  */
    // [COMMAND('setAttribute')] (attrs, ids = null, isChangeFragment = false) {
    //     this.$selection.itemsByIds(ids).forEach(item => {

    //         Object.keys(attrs).forEach(key => {
    //             const value = attrs[key];
    //             if (isFunction(value)) {
    //                 value = value();
    //             }

    //             item.reset({ [key] : value });
    //         })

    //         this.$editor.emit('refreshElement', item, isChangeFragment);
    //     });
    //     // { type: 'setAttribute', attrs, ids, isChangeFragment}
    // }

}