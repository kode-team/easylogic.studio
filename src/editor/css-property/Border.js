import { STRING_TO_CSS } from "../../util/functions/func";
import Color from "../../util/Color";

var BorderStyles = {
    "none": true,
    "hidden": true,
    "dotted": true,
    "dashed": true,
    "solid": true,
    "double": true,
    "groove": true,
    "ridge": true,
    "inset": true,
    "outset": true
}

export default class Border {
    static parseStyle (str) {
        return STRING_TO_CSS(str);
    }

    static parseValue (str) {
        var style = ''; 
        var width = ''; 
        var color = ''; 

        str.split(' ').filter(it => it.trim()).forEach(value => {
            if (BorderStyles[value]) {
                style = value; 
            } else if (Color.isColor(value)) {
                color = value; 
            } else {
                width = value; 
            }
        });

        return {
            style, color, width 
        }
    }

    static joinValue (obj) {
        return `${obj.width} ${obj.style} ${obj.color}`
    }

    static join (obj) {

        var arr = [
            obj['border'] ? `border: ${obj['border']}` : '',
            obj['border-top'] ? `border-top: ${obj['border-top']}` : '',
            obj['border-left'] ? `border-left: ${obj['border-left']}` : '',
            obj['border-right'] ? `border-right: ${obj['border-right']}` : '',
            obj['border-bottom'] ? `border-bottom: ${obj['border-bottom']}` : '',
        ].filter(it => it);

        return arr.join(';');
    }
}