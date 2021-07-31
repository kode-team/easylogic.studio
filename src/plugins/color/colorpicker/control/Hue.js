import { BIND, POINTERSTART } from 'el/sapa/Event';
import { EditorElement } from 'el/editor/ui/common/EditorElement';
import { Length } from 'el/editor/unit/Length';
import { END, MOVE } from 'el/editor/types/event';

export default class Hue extends EditorElement {

    initState() {
        return {
            hue: 0,
            minValue: 0,
            maxValue: 360
        }
    }

    template () {
        return /*html*/`
            <div class="hue">
                <div ref="$container" class="hue-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    [BIND('$bar')] () {

        const hue = this.state.hue

        return {
            style: {
                left: Length.percent(hue/360*100),
            },
            class: {
                first: hue <= this.state.minValue,
                last: hue >= this.state.maxValue
            }
        }
    }

    [POINTERSTART('$container') + MOVE('movePointer') + END('moveEndPointer')] (e) {
        this.rect = this.refs.$container.rect();

        this.refreshColorUI();
    }

    movePointer() {
        this.refreshColorUI();
    }

    refreshColorUI () {
        const minX = this.rect.left;
        const maxX = this.rect.right; 

        const currentX = Math.max(Math.min(maxX, this.$config.get('bodyEvent').clientX), minX); 
        const rate = (currentX - minX) / (maxX - minX);

        this.parent.changeColor({
            h: rate * this.state.maxValue,
            type: 'hsv'
        })

    }

    setValue (hue) {
        this.setState({
            hue
        })
    }
}
