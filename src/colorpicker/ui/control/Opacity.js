
import Color from '../../../util/Color'
import BaseSlider from '../../BaseSlider';

export default class Opacity extends BaseSlider {

    initialize () {
        super.initialize()

        this.minValue = 0;
        this.maxValue = 1;         
    }

    template () {
        return `
        <div class="opacity">
            <div ref="$container" class="opacity-container">
                <div ref="$colorbar" class="color-bar"></div>
                <div ref="$bar" class="drag-bar2"></div>
            </div>
        </div>
        `
    }

    refresh () {
        super.refresh()
        this.setOpacityColorBar()
    }

    setOpacityColorBar() {
        var rgb = {...this.$store.rgb};
    
        rgb.a = 0;
        var start = Color.format(rgb, 'rgb');
    
        rgb.a = 1;
        var end = Color.format(rgb, 'rgb');
    
        this.refs.$colorbar.css('background',  'linear-gradient(to right, ' + start + ', ' + end + ')');
    }

    getDefaultValue () {
        return this.$store.alpha
    }
    
    refreshColorUI(e) {
        var dist = this.getCalculatedDist(e);

        this.setColorUI( (dist/100) * this.maxValue);

        this.changeColor({
            a: (Math.floor(dist) / 100) * this.maxValue
        })

    }

}
