import { vec3 } from "gl-matrix";

import { POINTERSTART, MOVE, END, IF } from "el/base/Event";
import { Length } from "el/editor/unit/Length";
import Dom from "el/base/Dom";
import { KEY_CODE } from "el/editor/types/key";

import { EditorElement } from "el/editor/ui/common/EditorElement";
import { toRectVerties, toRectVertiesWithoutTransformOrigin } from "el/base/functions/collision";

import './DragAreaView.scss';

export default class DragAreaView extends EditorElement {

    initState() {
        return {
            mode: 'selection',
            x: Length.z(),
            y: Length.z(),
            width: Length.px(10000),
            height: Length.px(10000),
            cachedCurrentElement: {},
            html: '',
        }
    }

    template() {
        return /*html*/`
            <div class="elf--drag-area-view" ref="$dragAreaView"></div>            
        `
    }


    checkEmptyElement (e) {
        var $el = Dom.create(e.target)

        // hand tool 이 on 되어 있으면 드래그 하지 않는다. 
        if (this.$config.get('set.tool.hand')) {
            return false; 
        }

        const code = this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space);
        if (this.$keyboardManager.check(code)) {        // space 키가 눌러져있을 때는 실행하지 않는다. 
            return false;
        } 

        const mousePoint = this.$viewport.getWorldPosition(e);        

        if (this.state.mode !== 'selection') {
            return false; 
        }

        // altKey 를 누르고 있으면 동작하지 않음 
        // altKey 는 복제용도로 사용함 
        if (e.altKey) {
            return false; 
        }

        // artboard 에서 드래그 할 수 있도록 예외 처리 
        if ($el.hasClass('artboard')) {
            if (this.$selection.check({ id: $el.attr('data-id') })) {
                // selection 이 이미 되어 있는 상태면 선택 영역을 그리지 않는다. 
                return false; 
            }

            // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
            if (this.$selection.hasPoint(mousePoint)) {
                return false;
            }            

            return true; 
        }

        // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
        if (this.$selection.hasPoint(mousePoint)) {
            return false;
        }            

        if ($el.hasClass('is-not-drag-area')) {
            return false; 
        }

        if ($el.closest('element-item')) {
            return false;
        }

        return $el.hasClass('element-item') === false
            && $el.hasClass('selection-tool-item') === false 
            && $el.hasClass('pointer') === false
            && $el.hasClass('rotate-pointer') === false            
            && $el.hasClass('layer-add-view') === false                        
            && $el.hasClass('handle') === false            
            && $el.hasClass('path-draw-container') === false
            && $el.isTag('svg') === false 
            && $el.isTag('path') === false
            && $el.isTag('textPath') === false
            && $el.isTag('polygon') === false
            && $el.isTag('text') === false
            && $el.isTag('img') === false 
            && $el.attr('data-segment') !== 'true';
    }

    [POINTERSTART('$dragAreaView') + IF('checkEmptyElement') + MOVE('movePointer') + END('moveEndPointer')] (e) {
        this.initMousePoint = this.$viewport.getWorldPosition(e);

        this.$target = Dom.create(e.target);

        if (this.$editor.isSelectionMode()) {

            this.$config.set("hoverView", false);

            this.dragRect = {
                left: Length.px(this.initMousePoint[0]),
                top: Length.px(this.initMousePoint[1]),
                width: Length.z(),
                height: Length.z()
            }        
    
            this.emit('drawAreaView', this.dragRect);

            this.state.cachedCurrentElement = {}       

        }

    }

    getSelectedItems (rect, areaVerties) {

        var project = this.$selection.currentProject;
        let items = []
        let selectedArtboard = []        
        if (project) {    

            if (rect.width === 0 && rect.height === 0) {
                items = [] 
            } else {
                // 프로젝트 내에 있는 모든 객체 검색    
                project.layers.forEach(layer => {

                    if (layer.is('artboard') && layer.isIncludeByArea(areaVerties)) {        
                        selectedArtboard.push(layer);
                    } else if (layer.is('artboard') && layer.checkInArea(areaVerties) && layer.hasChildren() === false) {        
                        items.push(layer);                            
                    } else {
                        items.push.apply(items, layer.checkInAreaForAll(areaVerties))

                    }
                })

                if (items.length > 1) {
                    items = items.filter(it => it.is('artboard') === false);
                }
            }   
        }

        const selectedItems = selectedArtboard.length ? selectedArtboard : items; 

        return selectedItems;
    }

    movePointer (dx, dy) {
        const e = this.$config.get('bodyEvent');
        const targetMousePoint = this.$viewport.getWorldPosition();

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        if (e.shiftKey) {
            newDist[1] = newDist[0];
        }

        const startVertex = vec3.floor([], this.initMousePoint);
        const endVertex = vec3.floor([], vec3.add([], this.initMousePoint, newDist));

        const start = this.$viewport.applyVertex(startVertex);
        const end = this.$viewport.applyVertex(endVertex);

        const locaRect = toRectVerties([start, end]);

        this.dragRect = {
            left: Length.px(locaRect[0][0]),
            top: Length.px(locaRect[0][1]),
            width: Length.px(Math.abs(locaRect[1][0] - locaRect[0][0])),
            height: Length.px(Math.abs(locaRect[3][1] - locaRect[0][1]))
        }        

        this.emit('drawAreaView', this.dragRect);

        if (this.$editor.isSelectionMode()) {

            var {left: x, top: y, width, height } = this.dragRect
            var rect = {
                x: x.value, 
                y: y.value, 
                width: width.value,
                height: height.value
            }
    
            // var areaVerties = this.$viewport.createAreaVerties(rect.x, rect.y, rect.width, rect.height);

            var project = this.$selection.currentProject;
            if (project) {    
                const selectedItems = this.getSelectedItems(rect, toRectVertiesWithoutTransformOrigin([startVertex, endVertex]))

                if (this.$selection.select( ...selectedItems)) {
                    this.emit('refreshSelection')
                    this.emit('refreshSelectionTool', true);
                }


            }
        }
    }

    moveEndPointer () {
        this.$config.set("hoverView", true);

        this.emit('drawAreaView', {
            left: Length.px(-10000),
            top: Length.z(),
            width: Length.z(),
            height: Length.z()
        })


        this.$selection.reselect();
        this.emit('history.refreshSelection')
        this.emit('refreshSelectionTool', true);            


        this.sendHelpMessage();
        this.emit('removeGuideLine')
    }

    sendHelpMessage () {

        if (this.$selection.length === 1) {
            var current = this.$selection.current;

            if (current.is('svg-path', 'svg-brush', 'svg-polygon', 'svg-textpath')) {
                this.emit('addStatusBarMessage', 'Please click if you want to edit to path ');
            }

        } 

    }

}