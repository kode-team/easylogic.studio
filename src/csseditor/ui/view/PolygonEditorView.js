import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, POINTERMOVE, PREVENT, KEYUP, IF, STOP, CLICK, KEY } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import Dom from "../../../util/Dom";
import PathParser from "../../../editor/parse/PathParser";
import { Length } from "../../../editor/unit/Length";
import { recoverBezierLine, getBezierPointsLine } from "../../../util/functions/bezier";
import PolygonParser from "../../../editor/parse/PolygonParser";
import PolygonGenerator from "../../../editor/parse/PolygonGenerator";
import { SVGPolygonItem } from "../../../editor/items/layers/SVGPolygonItem";

export default class PolygonEditorView extends UIElement {

    initialize() {
        super.initialize();

        this.polygonParser = new PolygonParser();
        this.polygonGenerator = new PolygonGenerator(this)
    }

    initState() {
        return {
            isShow: false, 
            points: '',
            segments: [],
            mode: 'draw',
            starCount: 5, 
            starRadius: 5,
            starInnerRadiusRate: 0.5,
            $target: null
        }
    }

    template() {
        return `<div class='polygon-editor-view' tabIndex="-1" ref='$view' ></div>`
    }

    isStarMode () {
        return this.isMode('star')
    }

    isShow () {
        return this.state.isShow;
    }

    [KEYUP() + KEY(1) + KEY(2) + IF('isStarMode') + PREVENT + STOP] (e) {

        var dt = 1; 

        if (e.key === '1') {
            dt = -1; 
        }

        this.state.starCount += dt; 

        this.refreshStar()
        this.emit('changeStarManager', this.state.starCount, this.state.starInnerRadiusRate)
    } 

    refreshStar () {

        this.polygonGenerator.refreshStar();

        this.bindData('$view');            

        this.updatePolygonLayer(this.getViewRect());
    }

    [KEYUP() + KEY(3) + KEY(4) + IF('isStarMode') + PREVENT + STOP] (e) {

        var dt = 0.1; 

        if (e.key === '3') {
            dt = -0.1; 
        }

        this.state.starInnerRadiusRate += dt; 

        this.refreshStar()
        this.emit('changeStarManager', this.state.starCount, this.state.starInnerRadiusRate)        
    } 

    // svg 에는 키 이벤트를 줄 수 없어서 
    // document 전체에 걸어서 처리한다. 
    // 실행은 Polygon 에디터가 보일 때만 
    [KEYUP('document') + IF('isShow') + KEY('Escape') + KEY('Enter') + PREVENT] (e) {

        if (this.state.current) {
            this.refreshPolygonLayer();
        } else {    
            this.addPolygonLayer(this.getViewRect()); 
        }
        this.trigger('hidePolygonEditor');        
    }

    makePolygonLayer (pathRect) {
        var { points } = this.polygonGenerator.toPolygon(pathRect.x, pathRect.y, editor.scale);
        var artboard = editor.selection.currentArtboard
        var layer; 
        if (artboard) {

            var x = pathRect.x / editor.scale;
            var y = pathRect.y / editor.scale;
            var width = pathRect.width / editor.scale;
            var height = pathRect.height / editor.scale; 

            layer = artboard.add(new SVGPolygonItem({
                width: Length.px(width),
                height: Length.px(height),
                points
            }))

            layer.setScreenX(x);
            layer.setScreenY(y);
        }

        return layer; 
    }

    updatePolygonLayer (pathRect) {
        var { points } = this.polygonGenerator.toPolygon(pathRect.x, pathRect.y, editor.scale);

        var x = pathRect.x / editor.scale;
        var y = pathRect.y / editor.scale;
        var width = pathRect.width / editor.scale;
        var height = pathRect.height / editor.scale; 

        this.emit('updatePolygonItem', {
            x, y, width, height, points
        })
    }

    addPolygonLayer(pathRect) {
        this.changeMode('modify');
        // this.bindData('$view');


        var layer = this.makePolygonLayer(pathRect)
        if (layer) {
            editor.selection.select(layer);

            this.state.segments = [] 
            this.polygonParser.reset('')
            this.bindData('$view');

            this.emit('refreshAll')
            this.emit('refreshSelection');
        }

        // this.trigger('hidePathEditor');

    }

    changeMode (mode, obj) { 
        this.setState({
            mode,
            moveXY: null,
            ...obj
        }, false)    
    }

    isMode (mode) {
        return this.state.mode === mode; 
    }

    [EVENT('changeScale')] () {

        this.refresh();

    }

    refresh (obj) {

        if (obj && obj.points) {
            this.polygonParser.reset(obj.points)
            this.polygonParser.scale(editor.scale, editor.scale);
            this.polygonParser.translate(obj.screenX.value * editor.scale, obj.screenY.value * editor.scale)

            // points 문자열에서 변환된 point 는 segments 로 변경된다. 
            this.state.segments = this.polygonParser.convertGenerator();
        } else {
            this.state.segments = [] 
        }

        this.bindData('$view')

    }

    [EVENT('showPolygonEditor')] (mode = 'draw', obj = {}) {

        if (mode === 'move') {
            obj.current = null;
        } else {
            if (!obj.current) {
                obj.current = null; 
            }            
        }

        var newOptions = {
            ...obj,
            points: obj.points || ''
        }

        this.changeMode(mode, obj);
        this.refresh(newOptions);

        this.state.isShow = true; 
        this.$el.show();
        this.$el.focus();

        if (mode === 'star') {
            this.emit('showStarManager', {
                changeEvent: 'changeStarManager',
                count: this.state.starCount,
                radius: this.state.starInnerRadiusRate
            })
            this.emit('hidePolygonManager');
        } else {
            this.emit('showPolygonManager', { mode: this.state.mode });
            this.emit('hideStarManager');
        }
    }

    [EVENT('changeStarManager')] (count, radius) {

        this.state.starCount = count; 
        this.state.starInnerRadiusRate = radius; 

        this.refreshStar()

    }

    [EVENT('hidePolygonEditor')] () {
        this.polygonParser.reset([])
        this.state.segments = [];        
        this.state.isShow = false;         
        
        this.$el.hide();

        this.emit('hideStarManager');
        this.emit('hidePolygonManager');        
        this.emit('finishPolygonEdit')   
    }


    [EVENT('hideSubEditor')] () {
        // this.trigger('hidePolygonEditor');
    }

    [BIND('$view')] () {
        return {
            class: {
                'draw': this.state.mode === 'draw',
                'modify': this.state.mode === 'modify',
                'segment-move': this.state.mode === 'segment-move',
            },
            innerHTML: this.polygonGenerator.makeSVGPath()
        }
    }

    getXY ([x, y]) {
        return {x, y}
    }

    [CLICK('$view .split-path')] (e) {
        var parser = new PathParser(e.$delegateTarget.attr('d'));
        var clickPosition = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }; 

        var points = [
            this.getXY(parser.segments[0].values),
            this.getXY(parser.segments[1].values.slice(0, 2))
        ]

        var curve = recoverBezierLine(...points, 200)
        var t = curve(clickPosition.x, clickPosition.y);          


        this.polygonGenerator.setPointLine(getBezierPointsLine(points, t))

        this.changeMode('modify');
        this.bindData('$view');

        this.refreshPolygonLayer();

    }

    getViewRect () {
        var pathRect = this.refs.$view.$('polygon.object').rect()
        pathRect.x -= this.state.rect.x;
        pathRect.y -= this.state.rect.y;

        return pathRect;
    }

    refreshPolygonLayer () {
        this.updatePolygonLayer(this.getViewRect());
    }

    [POINTERMOVE('$view') + PREVENT] (e) {
        if (this.isMode('draw') && this.state.rect) {            
            this.state.moveXY = {
                x: e.xy.x - this.state.rect.x, 
                y: e.xy.y - this.state.rect.y 
            }; 

            this.state.altKey = e.altKey
            
            this.bindData('$view');
        } else {
            // this.state.altKey = false; 
        }

    }

    [POINTERSTART('$view :not(.split-path)') + MOVE() + END()] (e) {

        // console.log(e);

        this.state.rect = this.parent.refs.$body.rect();            
        this.state.canvasOffset = this.refs.$view.rect();
        this.state.altKey = false; 

        this.state.dragXY = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }; 

        this.$el.focus()

        this.state.$target = Dom.create(e.target);
        this.state.isSegment = this.state.$target.attr('data-segment') === 'true';

        if (this.state.isSegment) {

            this.changeMode('segment-move');
            var index = +this.state.$target.attr('data-index')
            this.polygonGenerator.setCachePoint(index);

        } else if (this.isMode('star')) {
            this.polygonGenerator.moveStart()

        } else if (this.isMode('draw')) {
            // this.changeMode('draw');   
        } else {

        }

    }

    move (dx, dy) {

        if (this.isMode('star')) {

            this.polygonGenerator.moveStar(dx, dy, editor.config.get('bodyEvent'));

            this.bindData('$view');            

        } else if (this.isMode('segment-move')) {

            this.polygonGenerator.move(dx, dy, editor.config.get('bodyEvent'));

            this.bindData('$view');            

            this.updatePolygonLayer(this.getViewRect());

        } else if (this.isMode('draw')) {
            // var e = editor.config.get('bodyEvent');

            // this.state.dragPoints = e.altKey ? false : true; 
        } else if (this.isMode('move')) {
            
        }

    }

    end (dx, dy) {

        if (this.state.$target.is(this.refs.$view) && editor.config.get('bodyEvent').altKey)  {
            // 에디팅  종료 
            this.trigger('hidePolygonEditor')
            this.changeMode('modify');            
            return ; 
        }

        if (this.isMode('segment-move')) {
            this.changeMode('modify');
        } else if (this.isMode('star')) {

            this.polygonGenerator.moveEndStar(dx, dy);

            this.bindData('$view');
        } else if (this.isMode('draw')) {            


            this.polygonGenerator.moveEnd(dx, dy);

            this.bindData('$view');

        }

    }   

} 