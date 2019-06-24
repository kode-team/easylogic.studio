import BaseSlider from '../../BaseSlider';
import { BIND } from '../../../util/Event';

export default class Value extends BaseSlider {

    template () {
        return `
            <div class="value">
                <div ref="$container" class="value-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    [BIND('$container')] () {
        return {
            style : {
                'background-color': this.parent.manager.toString('rgb')
            }
        }
    }

    getDefaultValue () {
        return this.parent.hsv.v 
    }
         
    refreshColorUI(e) {
        var dist = this.getCalculatedDist(e);

        this.setColorUI(dist/100 * this.state.maxValue)

        this.changeColor({
            type: 'hsv',
            v: dist/100 * this.state.maxValue
        })
    }    
    
}
