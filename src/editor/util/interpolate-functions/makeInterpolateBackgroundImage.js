import { makeInterpolateLength } from "./makeInterpolateLength";
import { BackgroundImage } from "../../css-property/BackgroundImage";
import { STRING_TO_CSS } from "../../../util/functions/func";
import { makeInterpolateString } from "./makeInterpolateString";
import { makeInterpolateImageResource } from "./makeInterpolateImageResource";
import { makeInterpolateIdentity } from "./makeInterpolateIdentity";

export function makeInterpolateBackgroundImage(layer, property, startValue, endValue) {

    var s = BackgroundImage.parseStyle(STRING_TO_CSS(startValue));
    var e = BackgroundImage.parseStyle(STRING_TO_CSS(endValue));

    var totalLength = Math.max(s.length, e.length)

    var list = [] 
    for(var i = 0, len = totalLength; i < len; i++) {
        var startObject = s[i] || null;
        var endObject = e[i] || null;

        if (startObject && !endObject) {
            // 처음은 있고 끝이 없을 때 
            list.push({
                image: makeInterpolateIdentity(layer, property, startObject.image),
                size: makeInterpolateIdentity(layer, property, startObject.size),
                width: makeInterpolateIdentity(layer, property, startObject.width),
                height: makeInterpolateIdentity(layer, property, startObject.height),
                x: makeInterpolateIdentity(layer, property, startObject.x),
                y: makeInterpolateIdentity(layer, property, startObject.y),
                blendMode: makeInterpolateIdentity(layer, property, startObject.blendMode),
                repeat: makeInterpolateIdentity(layer, property, startObject.repeat)
            })            
        } else if (!startObject && endObject) {
            // 처음은 없고 끝이 있을 때 
            list.push({
                image: makeInterpolateIdentity(layer, property, endObject.image),
                size: makeInterpolateIdentity(layer, property, endObject.size),
                width: makeInterpolateIdentity(layer, property, endObject.width),
                height: makeInterpolateIdentity(layer, property, endObject.height),
                x: makeInterpolateIdentity(layer, property, endObject.x),
                y: makeInterpolateIdentity(layer, property, endObject.y),
                blendMode: makeInterpolateIdentity(layer, property, endObject.blendMode),
                repeat: makeInterpolateIdentity(layer, property, endObject.repeat)
            })            
        } else if (startObject && endObject) {
            // 처음도 있고 끝도 있을 때 
            list.push({
                image: makeInterpolateImageResource(layer, property, startObject.image, endObject.image),
                size: makeInterpolateString(layer, property, startObject.size, endObject.size),
                width: makeInterpolateLength(layer, property, startObject.width, endObject.width, 'width', 'self'),
                height: makeInterpolateLength(layer, property, startObject.height, endObject.height, 'height', 'self'),                
                x: makeInterpolateLength(layer, property, startObject.x, endObject.x, 'width', 'self'),
                y: makeInterpolateLength(layer, property, startObject.y, endObject.y, 'height', 'self'),
                blendMode: makeInterpolateString(layer, property, startObject.blendMode, endObject.blendMode),
                repeat: makeInterpolateString(layer, property, startObject.repeat, endObject.repeat)
            })            
        }
    }

    return (rate, t) => {
        return BackgroundImage.join(list.map(it => {
            var data= {
                image: it.image(rate, t), 
                size: it.size(rate, t),
                x: it.x(rate, t),
                y: it.y(rate, t),
                width: it.width(rate, t),
                height: it.height(rate, t),
                blendMode: it.blendMode(rate, t), 
                repeat: it.repeat(rate, t)
            }
            return data; 
        }))
    }

}
