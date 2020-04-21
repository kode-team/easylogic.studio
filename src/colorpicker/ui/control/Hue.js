import BaseSlider from '../../BaseSlider';

export default class Hue extends BaseSlider {

    initState() {
        return {
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

    getDefaultValue () {
        return this.parent.hsv.h
    }

    refreshColorUI(e) {

        var dist = this.getCalculatedDist(e);
     
        this.setColorUI(dist/100 * this.state.maxValue);

        this.changeColor({
            h: (dist/100) * this.state.maxValue,
            type: 'hsv'
        })
    }     


}
