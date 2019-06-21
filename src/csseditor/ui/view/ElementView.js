import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND, POINTERSTART, MOVE, END } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { NEW_LINE, NEW_LINE_2 } from "../../../util/css/types";
import { CHANGE_SELECTION } from "../../types/event";
import { editor } from "../../../editor/editor";

export default class ElementView extends UIElement {


    initState() {
        return {
            html: ''
        }
    }


    template() {
        return `<div class='element-view' ref='$body'></div>`
    }

    [BIND('$body')] () {
        return {
            style: {
                'position': 'relative',
                'margin': '100px',
                'width': Length.px(10000),
                'height': Length.px(10000)
            },
            innerHTML: this.state.html 
        }
    }

    [EVENT(CHANGE_SELECTION)] () {

        var artboard = editor.selection.currentArtboard
        var html = '' 
        if (artboard) {
            html = artboard.layers.map(it => {
                return it.html
            }).join(NEW_LINE)
        }

        this.setState({ html })
    }

    [POINTERSTART('$body .item') + MOVE() + END()] (e) {
        var id = e.$delegateTarget.attr('data-id')

        // id 로 속성찾기 
        // selection 에 추가 
        // 시작 지점 정의 
    }

    move (dx, dy) {
        // current 객체에 selection 가지고 오기 
        // left, top 을 업데이트 하기 
    }
    
} 