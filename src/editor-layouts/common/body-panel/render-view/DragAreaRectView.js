import { Length } from "el/editor/unit/Length";

import { EditorElement } from "el/editor/ui/common/EditorElement";

import './DragAreaView.scss';
import { SUBSCRIBE } from "el/base/Event";


export default class DragAreaRectView extends EditorElement {

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
            <div class="elf--drag-area-view" ref="$dragAreaView" style="pointer-events:none;">
                <div class='drag-area-rect' ref='$dragAreaRect'></div>
            </div>            
        `
    }

    [SUBSCRIBE('drawAreaView')](style) {
        this.refs.$dragAreaRect.css(style);
    }

}