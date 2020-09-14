import Event from '@core/Event'
import BaseSlider from "./BaseSlider";

export default class VerticalSlider extends BaseSlider {

    /** get max height for vertical slider */
    getMaxDist () {
        return this.refs.$container.height();
    }

    /** set mouse pointer for vertical slider */
    setMousePosition (y) {
        this.refs.$bar.px('top', y);
    }

    /** get mouse position by pageY for vertical slider */    
    getMousePosition (e) {
        return Event.pos(e).pageY;
    }       

    /** get min position for vertial slider */
    getMinPosition () {
        return this.refs.$container.offset().top;
    }

    /** get calculated dist for domain value   */
    getCalculatedDist (e) {
        var current = e ? this.getMousePosition(e) : this.getCurrent(this.getDefaultValue() / this.state.maxValue);
        var dist =  100 - this.getDist(current);
        
        return dist; 
    }

    /** set drag bar position  */
    setColorUI(v) {
        
        v = v || this.getDefaultValue(); 

        if (v <= this.minValue) {
            this.refs.$bar.addClass('first').removeClass('last')
        } else if (v >= this.maxValue) {
            this.refs.$bar.addClass('last').removeClass('first')
        } else {
            this.refs.$bar.removeClass('last').removeClass('first')
        }

        var per = 1 - ( (v || 0) / this.state.maxValue);

        this.setMousePosition(this.getMaxDist() * per );
    }        
}
