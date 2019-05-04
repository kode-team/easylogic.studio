
import Event from '../util/Event'
import BaseBox from './BaseBox';
import { px } from '../util/css/types';

export default class BaseSlider extends BaseBox {

    initialize () {
        super.initialize()
        this.minValue = 0   // min domain value 
        this.maxValue = 1   // max domain value 
    }

    /* slider container's min and max position */
    getMinMaxPosition () {
        var min = this.getMinPosition();
        var width = this.getMaxDist()
        var max = min + width;

        return { min, max, width }
    }

    /** get current position on page  */
    getCurrent (value) {
        return min + this.getMaxDist() * value; 
    }

    /** get min position on slider container  */
    getMinPosition () {
        return this.refs.$container.offset().left;
    }    

    getMaxDist () {
        return this.refs.$container.width();
    }

    /** get dist for position value */
    getDist (current) {
        var {min, max} = this.getMinMaxPosition()

        var dist; 
        if (current < min) {
            dist = 0;
        } else if (current > max) {
            dist = 100;
        } else {
            dist = (current - min) / (max - min) * 100;
        }

        return dist; 
    }

    /** get calculated dist for domain value   */
    getCalculatedDist (e) {
        var current = e ? this.getMousePosition(e) : this.getCurrent(this.getDefaultValue() / this.maxValue);
        var dist = this.getDist(current);
        
        return dist; 
    }

    /** get default value used in slider container */
    getDefaultValue () {
        return 0
    }

    /** set mosue position */
    setMousePosition (x) {
        this.refs.$bar.css({ left : px(x) });
    }

    /** set mouse position in page */
    getMousePosition (e) {
        return Event.pos(e).pageX;
    }    
 
    refresh () {
        this.setColorUI()
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

        this.setMousePosition(this.getMaxDist() * ( (v || 0) / this.maxValue));
    }    
    
}
