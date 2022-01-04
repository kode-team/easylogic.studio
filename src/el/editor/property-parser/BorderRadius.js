import { Length } from "el/editor/unit/Length";

export default class BorderRadius {
    static parseStyle (str = '') {
        
        var obj = {
            isAll: true,
            'border-radius': 0,
            'border-top-left-radius': 0,
            'border-top-right-radius': 0,
            'border-bottom-right-radius': 0,
            'border-bottom-left-radius': 0
        }

        var temp = {} 
        var arr = str.split(' ').filter(it => Length.parse(it))

        if (arr.length === 1) {
            obj.isAll = true; 
            obj['border-radius'] = arr[0]
        } else {
            obj.isAll = false; 
            obj['border-top-left-radius'] = arr[0];
            obj['border-top-right-radius'] = arr[1];
            obj['border-bottom-right-radius'] = arr[2];
            obj['border-bottom-left-radius'] = arr[3];
        }

        return obj; 
    }
}