
import { BIND, SUBSCRIBE } from "el/base/Event";
import { Length } from "el/editor/unit/Length";

import HTMLRenderer from 'el/editor/renderer/HTMLRenderer';

import { isFunction } from "el/base/functions/func";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../../common/EditorElement";


export default class PlayerHTMLRenderView extends EditorElement {

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
            <div class='element-view' ref='$body'>
                <div class='canvas-view' ref='$view'></div>
                <object refClass='StyleView' ref='$styleView' />
            </div>
        `
    }

    getScrollXY () {
        return {
            width: this.refs.$body.scrollWidth(),
            height: this.refs.$body.scrollHeight(),
            left: this.refs.$body.scrollLeft(),
            top: this.refs.$body.scrollTop()
        }
    }

    get selectionToolView () {
        return this.$selection.isMany ? this.children.$groupSelectionTool : this.children.$selectionTool;
    }

    [SUBSCRIBE('refElement')] (id, callback) {
        isFunction(callback) && callback(this.getElement(id))
    }

    getElement (id) {

        if (!this.state.cachedCurrentElement[id]) {
            this.state.cachedCurrentElement[id] = this.refs.$view.$(`[data-id="${id}"]`);
        }

        return this.state.cachedCurrentElement[id];
    }


    [BIND('$body')] () {
        const { canvasWidth, canvasHeight, mode} = this.$editor;

        var width = Length.px(canvasWidth);
        var height = Length.px(canvasHeight);

        return {
            'data-mode': mode,
            'tabIndex': -1,
            style: { 
                width, 
                height, 
            }
        }
    }

    [BIND('$view')] () {

        const { translate, transformOrigin: origin, scale} = this.$viewport;      
        
        const transform =  `translate(${translate[0]}px, ${translate[1]}px) scale(${scale || 1})`;
        const transformOrigin = `${origin[0]}px ${origin[1]}px`

        this.refs.$view.$$('.artboard-title').forEach($title => {
            $title.css('transform-origin', `bottom left`)
            $title.css('transform', `scale(${1/scale})`)
        })

        return {
            style: { 
                'transform-origin': transformOrigin,
                transform
            }
        }
    }    


    selectCurrent (...args) {
        this.state.cachedCurrentElement = {}
        var $selectedElement = this.$el.$$('.selected');

        if ($selectedElement.length) {
            $selectedElement.forEach(it => it.removeClass('selected'))
        }


        if(args.length) {

            var selector = args.map(it => `[data-id='${it.id}']`).join(',')

            var list = this.$el.$$(selector);

            if (list.length) {
                list.forEach(it => {
                    this.state.cachedCurrentElement[it.attr('data-id')] = it; 
                    it.addClass('selected')
                })
            }

        }    
    }

    // 객체를 부분 업데이트 하기 위한 메소드 
    [SUBSCRIBE('refreshSelectionStyleView')] (obj) {
        var items = obj ? [obj] : this.$selection.items;

        items.forEach(current => {
            this.updateElement(current);
        })

        this.selectCurrent(...items);
    }

    updateElement (item) {
        if (item) { 
            HTMLRenderer.update(item, this.getElement(item.id))
            // this.updateRealPositionByItem(item);
        }

    }

    // 타임라인에서 객체를 업데이트 할 때 발생함. 
    updateTimelineElement (item) {
        if (item) {
            HTMLRenderer.update(item, this.getElement(item.id))
            // this.updateRealPositionByItem(item);
        }

    }    

    [SUBSCRIBE('playTimeline', 'moveTimeline')] () {

        const project = this.$selection.currentProject;
        var timeline = project.getSelectedTimeline();

        if (timeline) {
            timeline.animations.map(it => project.searchById(it.id)).forEach(current => {
                this.updateTimelineElement(current, true, false);
            })
        }

    }    

    /**
     * canvas 전체 다시 그리기 
     */
    [SUBSCRIBE('refreshAllCanvas')] () {

        const project = this.$selection.currentProject
        const html = HTMLRenderer.render(project) || '';

        this.setState({ html }, false)
        this.refs.$view.updateDiff(html)

        this.bindData('$view');
    }

    [SUBSCRIBE('refreshAllElementBoundSize')] () {

        var selectionList = this.$selection.items.map(it => it.is('artboard') ? it : it.parent)

        var list = [...new Set(selectionList)];
        list.forEach(it => {
            this.trigger('refreshElementBoundSize', it);
        })
    }

    [SUBSCRIBE('refreshElementBoundSize')] (parentObj) {
        if (parentObj) {
            parentObj.layers.forEach(it => {
                if (it.isLayoutItem()) {
                    var $el = this.getElement(it.id);

                    if ($el) {
                        const {x, y, width, height} = $el.offsetRect();

                        it.reset({
                            x: Length.px(x),
                            y: Length.px(y),
                            width: Length.px(width), 
                            height: Length.px(height)
                        })
    
                        // if (it.is('component')) {
                        //     this.emit('refreshStyleView', it, true);
                        // }
    
                        // svg 객체  path, polygon 은  크기가 바뀌면 내부 path도 같이 scale up/down  이 되어야 하는데 
                        // 이건 어떻게 적용하나 ....                     
                        this.trigger('refreshSelectionStyleView', it, true);
                    }
                }

                this.trigger('refreshElementBoundSize', it);  
            })
        }
    }   

    [SUBSCRIBE('updateViewport')] () {
        this.bindData('$view');        
    }

}

registElement({ PlayerHTMLRenderView })