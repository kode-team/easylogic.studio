import { Length } from "../unit/Length";

export default class BorderRadius {
    static parseStyle (str) {
        
        var obj = {
            isAll: true,
            'border-radius': Length.px(0),
            'border-top-left-radius': Length.px(0),
            'border-top-right-radius': Length.px(0),
            'border-bottom-left-radius': Length.px(0),
            'border-bottom-right-radius': Length.px(0)
        }

        var temp = {} 
        str.split(';').filter(it => it.includes(':')).forEach(borderValue => {
            var [key, value] = borderValue.split(':').map(it => it.trim())
            
            value = Length.parse(value);

            if (obj[key]) {
                obj[key] = value; 
            }

            temp[key] = true; 
        })

        if (temp['border-radius']) obj.isAll = true; 

        return obj; 
    }
}