import Color from '../../util/Color'
import HueColor from '../../util/HueColor'
import { isUndefined, isString } from '../../util/functions/func';
import { ACTION, GETTER } from '../../util/Store';
import BaseModule from '../../util/BaseModule';

export default class ColorManager extends BaseModule {

    initialize () {        
        super.initialize()

        this.$store.rgb = {}
        this.$store.hsl = {}
        this.$store.hsv = {}
        this.$store.alpha = 1 
        this.$store.format = 'hex'

        // this.$store.dispatch('changeColor');
    }

    [ACTION('changeFormat')] ($store, format) {
        $store.format = format;

        $store.emit('changeFormat');
    }

    [ACTION('initColor')] ($store, colorObj, source) {
        $store.dispatch('changeColor', colorObj, source, true);
        $store.emit('initColor')
    }

    [ACTION('changeColor')] ($store, colorObj, source, isNotEmit) {

        colorObj = colorObj || '#FF0000'

        if (isString(colorObj)) {
            colorObj = Color.parse(colorObj);
        }

        colorObj.source = colorObj.source || source 

        $store.alpha = isUndefined(colorObj.a) ? $store.alpha : colorObj.a; 
        $store.format = colorObj.type != 'hsv' ? (colorObj.type || $store.format) : $store.format;

        if ($store.format == 'hex' && $store.alpha < 1) {
            $store.format = 'rgb';
        }

        if (colorObj.type == 'hsl') {
            $store.hsl = {...$store.hsl, ...colorObj}; 
            $store.rgb = Color.HSLtoRGB($store.hsl);
            $store.hsv = Color.HSLtoHSV(colorObj);            
        } else if (colorObj.type == 'hex') {
            $store.rgb = {...$store.rgb, ...colorObj};
            $store.hsl = Color.RGBtoHSL($store.rgb);
            $store.hsv = Color.RGBtoHSV(colorObj);            
        } else if (colorObj.type == 'rgb') {
            $store.rgb = {...$store.rgb, ...colorObj};
            $store.hsl = Color.RGBtoHSL($store.rgb);            
            $store.hsv = Color.RGBtoHSV(colorObj);            
        } else if (colorObj.type == 'hsv') {
            $store.hsv = {...$store.hsv, ...colorObj};
            $store.rgb = Color.HSVtoRGB($store.hsv);
            $store.hsl = Color.HSVtoHSL($store.hsv);
        }

        if (!isNotEmit) {
            $store.emit('changeColor', colorObj.source);
        }

    }

    [GETTER('getHueColor')] ($store) {
        return HueColor.checkHueColor($store.hsv.h/360);
    }

    [GETTER('toString')] ($store, type) {
        type = type || $store.format
        var colorObj = $store[type] || $store.rgb
        return Color.format({...colorObj, a: $store.alpha}, type);
    }

    [GETTER('toColor')] ($store, type) {
        type = (type || $store.format).toLowerCase(); 

        if (type == 'rgb') {
            return $store.read('toRGB')
        } else if (type == 'hsl') {
            return $store.read('toHSL')
        } else if (type == 'hex') {
            return $store.read('toHEX')            
        }

        return $store.read('toString', type);
    }

    [GETTER('toRGB')] ($store) {
        return $store.read('toString', 'rgb')
    }

    [GETTER('toHSL')] ($store) {
        return $store.read('toString', 'hsl')
    }

    [GETTER('toHEX')] ($store) {
        return $store.read('toString', 'hex').toUpperCase()
    }

}