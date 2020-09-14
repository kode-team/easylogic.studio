
import Color from '@core/Color'
import BaseSlider from '../../BaseSlider';

export default class Opacity extends BaseSlider {

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

    refresh () {
        super.refresh()
        this.setOpacityColorBar()
    }

    setOpacityColorBar() {
        var rgb = {...this.parent.rgb};
    
        rgb.a = 0;
        var start = Color.format(rgb, 'rgb');
    
        rgb.a = 1;
        var end = Color.format(rgb, 'rgb');
    
        this.refs.$colorbar.css('background',  'linear-gradient(to right, ' + start + ', ' + end + ')');
    }

    getDefaultValue () {
        return this.parent.alpha
    }
    
    refreshColorUI(e) {
        var dist = this.getCalculatedDist(e);

        this.setColorUI( (dist/100) * this.state.maxValue);

        this.changeColor({
            a: (Math.floor(dist) / 100) * this.state.maxValue
        })

    }

}
