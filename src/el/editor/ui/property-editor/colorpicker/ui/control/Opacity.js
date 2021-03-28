
import Color from 'el/base/Color'
import { BIND, END, MOVE, POINTERSTART } from 'el/base/Event';
import { clone } from 'el/base/functions/func';
import { EditorElement } from 'el/editor/ui/common/EditorElement';
import { Length } from 'el/editor/unit/Length';

export default class Opacity extends EditorElement {

    initState() {
        return {
            colorbar: Color.parse('rgba(0, 0, 0, 1)'),
            opacity: 0,
            minValue: 0,
            maxValue: 100
        }
    }

    template () {
        return /*html*/`
        <div class="opacity">
            <div ref="$container" class="opacity-container">
                <div ref="$colorbar" class="color-bar"></div>
                <div ref="$bar" class="drag-bar2"></div>
            </div>
        </div>
        `
    }

    [BIND('$colorbar')] () {
        const rgb = clone(this.state.colorbar);
    
        rgb.a = 0;
        const start = Color.format(rgb, 'rgb');
    
        rgb.a = 1;
        const end = Color.format(rgb, 'rgb');
    
        return {
            style: {
                background:  `linear-gradient(to right, ${start}, ${end})`
            }
        }
    }

    [BIND('$bar')] () {

        const opacity = this.state.opacity * 100

        return {
            style: {
                left: Length.percent(opacity),
            },
            class: {
                first: opacity <= this.state.minValue,
                last: opacity >= this.state.maxValue
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
            a: rate,
        })

    }

    setValue (colorbar, opacity) {
        this.setState({ 
            opacity,
            colorbar 
        })
    }

}
