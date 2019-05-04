import BaseSlider from '../../BaseSlider';

export default class Value extends BaseSlider {

    initialize () {
        super.initialize()

        this.minValue = 0;
        this.maxValue = 1; 
    }

    template () {
        return `
            <div class="value">
                <div ref="$container" class="value-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    setBackgroundColor () {
        this.refs.$container.css("background-color", this.read('toRGB'));
    }


    refresh () {
        super.refresh()
        this.setBackgroundColor();
    }

    getDefaultValue () {
        return this.$store.hsv.v 
    }
         
    refreshColorUI(e) {
        var dist = this.getCalculatedDist(e);

        this.setColorUI(dist/100 * this.maxValue)

        this.changeColor({
            type: 'hsv',
            v: dist/100 * this.maxValue
        })
    }    
    
}
