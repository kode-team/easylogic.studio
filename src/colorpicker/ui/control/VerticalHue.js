import VerticalSlider from '../../VerticalSlider';

export default class VerticalHue extends VerticalSlider {

    initialize () {
        super.initialize()
        this.minValue = 0
        this.maxValue = 360 
    }

    template () {
        return `
            <div class="hue">
                <div ref="$container" class="hue-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    getDefaultValue () {
        return this.parent.hsv.h 
    }

    refreshColorUI(e) {

        var dist = this.getCalculatedDist(e)
    
        this.setColorUI( dist/100 * this.maxValue);

        this.changeColor({
            h: (dist/100) * this.maxValue,
            type: 'hsv'
        })
    }     

}
